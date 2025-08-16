import prisma from "../../../db";
import { Prisma, TicketPriority } from "../../../generated/prisma";
import { NotFoundError } from "../../../middlewares/error";
import type { TicketFilters } from "../../../types/ticket.types";
import { getAssetTypeFromUrl } from "../../../utils/getAssetType";
import type { CreateTicketInput, UpdateTicketInput } from "./ticket.schema";

//create ticket
export const createTicketService = async (data: CreateTicketInput) => {
  const {
    title,
    description,
    name,
    email,
    phone,
    address,
    priority,
    status,
    assets,
  } = data;

  return prisma.$transaction(async (tx) => {
    let customer = null;

    if (email) {
      customer = await tx.customer.findUnique({ where: { email } });
    }

    if (!customer && phone) {
      customer = await tx.customer.findFirst({ where: { phone } });
    }

    if (!customer) {
      customer = await tx.customer.create({
        data: {
          name: name || "Unregistered Customer",
          email: email || `${Date.now()}@temp.local`,
          phone,
          address,
          isRegistered: false,
          isVerified: false,
        },
      });
    }

    const ticket = await tx.ticket.create({
      data: {
        title,
        description,
        name,
        email,
        phone,
        address,
        priority,
        status,
        customerId: customer.id,
      },
      select: { id: true, title: true, customerId: true },
    });

    if (assets?.length) {
      const assetsData = assets.map((asset) => ({
        ticketId: ticket.id,
        url: asset.url,
        type: getAssetTypeFromUrl(asset.url),
      }));

      await tx.ticketAsset.createMany({
        data: assetsData,
      });
    }

    return {
      success: true,
      message: "Ticket created Successfully",
      data: {
        id: ticket.id,
        title: ticket.title,
      },
    };
  });
};

//update ticket
export const updateTicketService = async (
  ticketId: string,
  data: UpdateTicketInput
) => {
  const { title, description, address, priority, status, assets } = data;
  return prisma.$transaction(async (tx) => {
    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId, isDeleted: false },
      data: {
        title: title,
        description: description,
        address: address,
        priority: priority,
        status: status,
        updatedAt: new Date(),
      },
      select: { id: true, title: true, status: true, priority: true },
    });

    if (assets && assets.length > 0) {
      await tx.ticketAsset.deleteMany({ where: { ticketId } });

      await tx.ticketAsset.createMany({
        data: assets.map((asset) => ({
          ticketId,
          url: asset.url,
          type: getAssetTypeFromUrl(asset.url),
        })),
      });
    }

    return {
      success: true,
      message: "Ticket updated Successfully",
      data: {
        id: updatedTicket.id,
        title: updatedTicket.title,
        priority: updatedTicket.priority,
        status: updatedTicket.status,
      },
    };
  });
};

//delete ticket
export const deleteTicketService = async (ticketId: string) => {
  const deletedTicket = await prisma.ticket.update({
    where: { id: ticketId, isDeleted: false },
    data: { isDeleted: true, updatedAt: new Date() },
  });

  return {
    success: true,
    message: "Ticket Deleted Successfully",
    data: {
      id: deletedTicket.id,
    },
  };
};

//get all tickets
export const getTicketsService = async (filters: TicketFilters) => {
  const where: Prisma.TicketWhereInput = {
    isDeleted: false,
  };

  // date range filter
  if (filters.fromDate || filters.toDate) {
    where.createdAt = {};
    if (filters.fromDate) {
      where.createdAt.gte = new Date(filters.fromDate);
    }
    if (filters.toDate) {
      where.createdAt.lte = new Date(filters.toDate);
    }
  }

  //priority filter
  if (filters.priority) {
    where.priority = filters.priority;
  }

  //status filter
  if (filters.status) {
    where.status = filters.status;
  }

  //search filter
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { name: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
      { address: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  //sorting
  const orderBy: Prisma.TicketOrderByWithRelationInput = {};
  if (filters.sortBy) {
    (orderBy as any)[filters.sortBy] = filters.sortOrder || "asc";
  } else {
    orderBy.createdAt = "desc";
  }

  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;
  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        priority: true,
        status: true,
        name: true,
        email: true,
        customer: { select: { id: true, name: true, email: true } },
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.ticket.count({ where }),
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

export const getTicketByIdService = async (id: string) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      title: true,
      description: true,
      priority: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      assets: {
        select: {
          id: true,
          url: true,
          type: true,
        },
      },
    },
  });

  if (!ticket) throw new NotFoundError("Employee not found");

  return {
    success: true,
    message: "Ticket fetched successfully",
    data: ticket,
  };
};
