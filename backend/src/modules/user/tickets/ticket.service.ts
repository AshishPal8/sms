import prisma from "../../../db";
import { AssignmentRole } from "../../../generated/prisma";
import { NotFoundError } from "../../../middlewares/error";
import { getAssetTypeFromUrl } from "../../../utils/getAssetType";
import type {
  createTicketInput,
  createTicketItemInput,
  updateTicketInput,
} from "./ticket.schema";

// create ticket
export const createTicketService = async (
  data: createTicketInput,
  customerId: string
) => {
  const { title, description, name, phone, address, assets } = data;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { phone: true, address: true, name: true },
  });

  if (!customer) {
    throw new NotFoundError("Customer not found");
  }

  const updateData: { phone?: string; address?: string } = {};

  if (!customer.phone && phone) {
    updateData.phone = phone;
  }

  if (!customer.address && address) {
    updateData.address = address;
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.customer.update({
      where: { id: customerId },
      data: updateData,
    });
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      name,
      phone,
      address,
      customerId,
      assets: {
        create: assets?.map((asset) => ({
          url: asset.url,
          type: getAssetTypeFromUrl(asset.url),
        })),
      },
    },
    include: { assets: true },
  });

  return {
    success: true,
    message: "Ticket created successfully",
    data: {
      id: ticket.id,
      title: ticket.title,
    },
  };
};

// update ticket
export const updateTicketService = async (
  data: updateTicketInput,
  ticketId: string
) => {
  const { title, description, address, assets } = data;

  const updateData: any = {};

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (address !== undefined) updateData.address = address;

  if (assets) {
    updateData.assets = {
      deleteMany: {},
      create: assets.map((asset) => ({
        url: asset.url,
        type: getAssetTypeFromUrl(asset.url),
      })),
    };
  }

  const ticket = await prisma.ticket.update({
    where: { id: ticketId },
    data: updateData,
    include: { assets: true },
  });

  return {
    success: true,
    message: "Ticket updated successfully",
    data: {
      id: ticket.id,
      title: ticket.title,
    },
  };
};

// delete ticket
export const deleteTicketService = async (ticketId: string) => {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { isDeleted: true },
  });

  return {
    success: true,
    message: "Ticket deleted successfully",
  };
};

// get customer ticket
export const getCustomerTicketsService = async (
  customerId: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where: { customerId, isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        address: true,
        status: true,
        assets: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.ticket.count({
      where: { customerId, isDeleted: false },
    }),
  ]);

  return {
    success: true,
    message: "Ticket fetched successfully",
    data: tickets,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// get customer ticket by id
export const getCustomerTicketByIdService = async (
  ticketId: string,
  customerId: string
) => {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      customerId,
      isDeleted: false,
    },
    include: {
      assets: true,
      items: {
        where: {
          OR: [
            { isPublic: true },
            { assignedToCustomerId: customerId },
            { assignedByCustomerId: customerId },
          ],
        },
        include: {
          assets: true,
          assignedByAdmin: true,
          assignedByDept: true,
          assignedByCustomer: true,
          assignedToAdmin: true,
          assignedToDept: true,
          assignedToCustomer: true,
        },
      },
    },
  });

  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }

  return {
    success: true,
    message: "Ticket fetched successfully",
    data: ticket,
  };
};

// create ticket item
export const createTicketItemService = async (
  customerId: string,
  ticketId: string,
  data: createTicketItemInput
) => {
  const { title, description, assets } = data;

  const ticketItem = await prisma.ticketItem.create({
    data: {
      ticketId,
      title,
      description: description || "",
      isPublic: true,
      assignedByRole: AssignmentRole.CUSTOMER,
      assignedByCustomerId: customerId,
      assets: {
        create:
          data.assets?.map((a) => ({
            url: a.url,
            type: getAssetTypeFromUrl(a.url),
          })) || [],
      },
    },
  });

  if (!ticketItem) {
    throw new NotFoundError("Ticket item not found!");
  }

  return {
    success: true,
    message: "Ticket item create successfully",
    data: {
      id: ticketItem.id,
      ticketId,
      title,
    },
  };
};

export const deleteTicketItemService = async (ticketItemId: string) => {
  const item = await prisma.ticketItem.findUnique({
    where: { id: ticketItemId },
    include: { assets: true },
  });

  if (!item) throw new NotFoundError("Ticket item not found");

  // TODO: delete images from storage also

  await prisma.ticketItemAsset.deleteMany({
    where: { ticketItemId },
  });

  await prisma.ticketItem.delete({ where: { id: ticketItemId } });

  return {
    success: true,
    message: "Ticket item deleted successfully",
  };
};
