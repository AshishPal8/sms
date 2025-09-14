import prisma from "../../../db";
import { ActionType } from "../../../generated/prisma";
import { AdminRole } from "../../../generated/prisma";
import { Prisma } from "../../../generated/prisma";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import type { TicketFilters } from "../../../types/ticket.types";
import { formatAddressString } from "../../../utils/formatAddressString";
import { getAssetTypeFromUrl } from "../../../utils/getAssetType";
import { roles } from "../../../utils/roles";
import { subDays } from "../../../utils/subDays";
import { emailService } from "../../email/email.service";
import { createNotificationService } from "../../notification/notification.service";
import type {
  CreateTicketInput,
  CreateTicketItemInput,
  UpdateTicketInput,
  UpdateTicketItemInput,
} from "./ticket.schema";

//create ticket
export const createTicketService = async (data: CreateTicketInput) => {
  const {
    title,
    description,
    firstname,
    lastname,
    email,
    phone,
    address,
    priority,
    status,
    urgencyLevel,
    assets,
    insuranceCompany,
    policyNumber,
    policyExpiryDate,
    insuranceContactNo,
    insuranceDeductable,
    isRoofCovered,
  } = data;

  const formattedAddress = formatAddressString(address);

  return prisma.$transaction(async (tx) => {
    let customer = null;
    if (email) {
      customer = await tx.customer.findUnique({
        where: { email },
        select: {
          id: true,
          addressId: true,
          phone: true,
          insuranceCompany: true,
          policyNumber: true,
          policyExpiryDate: true,
          insuranceContactNo: true,
          insuranceDeductable: true,
          isRoofCovered: true,
        },
      });
    }
    if (!customer && phone) {
      customer = await tx.customer.findFirst({
        where: { phone },
        select: {
          id: true,
          addressId: true,
          phone: true,
          insuranceCompany: true,
          policyNumber: true,
          policyExpiryDate: true,
          insuranceContactNo: true,
          insuranceDeductable: true,
          isRoofCovered: true,
        },
      });
    }

    // prepare address payload for nested create/update if address object provided
    const addressPayload =
      address && typeof address === "object"
        ? {
            houseNumber: address.houseNumber ?? undefined,
            locality: address.locality ?? undefined,
            city: address.city ?? undefined,
            state: address.state ?? undefined,
            country: address.country ?? undefined,
            postalCode: address.postalCode ?? undefined,
          }
        : null;

    if (!customer) {
      // create new customer with nested address if provided
      customer = await tx.customer.create({
        data: {
          firstname: firstname || "Unregistered user",
          lastname: lastname || null,
          email: email ?? `${Date.now()}@temp.local`,
          phone,
          profilePicture: undefined,
          insuranceCompany,
          policyNumber,
          policyExpiryDate,
          insuranceContactNo,
          insuranceDeductable,
          isRoofCovered: isRoofCovered ?? false,
          isRegistered: false,
          isVerified: false,
          ...(addressPayload
            ? {
                address: {
                  create: addressPayload,
                },
              }
            : {}),
        },
        select: { id: true },
      });
    } else {
      const updateData: any = {};

      if (!customer.phone && phone) updateData.phone = phone;
      if (!customer.insuranceCompany && insuranceCompany)
        updateData.insuranceCompany = insuranceCompany;
      if (
        (customer.insuranceDeductable === undefined ||
          customer.insuranceDeductable === null) &&
        insuranceDeductable !== undefined
      )
        updateData.insuranceDeductable = insuranceDeductable;
      if (
        (customer.isRoofCovered === undefined ||
          customer.isRoofCovered === null) &&
        isRoofCovered !== undefined
      )
        updateData.isRoofCovered = isRoofCovered;

      if (addressPayload) {
        if (customer.addressId) {
          // update existing Address
          updateData.address = {
            update: addressPayload,
          };
        } else {
          // create Address and connect
          updateData.address = {
            create: addressPayload,
          };
        }
      }

      if (Object.keys(updateData).length > 0) {
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: updateData,
          select: { id: true },
        });
      }
    }

    const ticket = await tx.ticket.create({
      data: {
        title,
        description,
        name: `${firstname}${lastname ? " " + lastname : ""}`,
        email,
        phone,
        address: formattedAddress,
        priority,
        status,
        urgencyLevel,
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

    // Send confirmation email
    // await emailService.sendTicketCreatedMail(customer.email, {
    //   customerName: customer.name,
    //   ticketTitle: ticket.title,
    //   ticketId: ticket.id,
    // });

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
  const {
    title,
    description,
    address,
    priority,
    status,
    urgencyLevel,
    assets,
  } = data;

  const formattedAddress = formatAddressString(address);

  return prisma.$transaction(async (tx) => {
    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId, isDeleted: false },
      data: {
        title,
        description,
        address: formattedAddress,
        priority,
        status,
        urgencyLevel,
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
export const getTicketsService = async (
  user: { id: string; role: string },
  filters: TicketFilters
) => {
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

  //Ticket urgency filter
  if (filters.urgencyLevel) {
    where.urgencyLevel = filters.urgencyLevel;
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
        urgencyLevel: true,
        name: true,
        email: true,
        customer: {
          select: { id: true, firstname: true, lastname: true, email: true },
        },
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            id: true,
            assignedByRole: true,
            assignedByAdminId: true,
            assignedByCustomerId: true,
            assignedToRole: true,
            assignedToAdminId: true,
            assignedToCustomerId: true,
          },
        },
      },
    }),

    prisma.ticket.count({ where }),
  ]);

  let filteredTickets = tickets;

  if ([roles.SUPERADMIN, roles.ASSISTANT].includes(user.role)) {
  } else if (user.role === roles.MANAGER) {
    const manager = await prisma.admin.findUnique({
      where: { id: user.id },
      include: { department: true },
    });

    if (manager) {
      filteredTickets = tickets.filter((ticket) =>
        ticket.items.some(
          (item) =>
            (manager.id && item.assignedByAdminId === manager.id) ||
            (manager.id && item.assignedToAdminId === manager.id)
        )
      );
    } else {
      filteredTickets = [];
    }
  } else if (user.role === roles.TECHNICIAN) {
    filteredTickets = tickets.filter((ticket) =>
      ticket.items.some(
        (item) =>
          item.assignedByAdminId === user.id ||
          item.assignedToAdminId === user.id
      )
    );
  } else if (user.role === roles.CUSTOMER) {
    filteredTickets = tickets.filter(
      (ticket) =>
        ticket.customer?.id === user.id ||
        ticket.items.some(
          (item) =>
            item.assignedByCustomerId === user.id ||
            item.assignedToCustomerId === user.id
        )
    );
  }

  return {
    success: true,
    message: "Ticket fetched successfully",
    data: filteredTickets.map((ticket) => ({
      ...ticket,
      items: undefined,
    })),
    meta: {
      total: filteredTickets.length,
      page,
      limit,
      totalPages: Math.ceil(filteredTickets.length / limit),
    },
  };
};

export const getTicketStatsService = async (user: {
  id: string;
  role: string;
}) => {
  const { id: userId, role } = user;

  let where: any = {
    isDeleted: false,
  };

  if ([roles.SUPERADMIN, roles.ASSISTANT].includes(role)) {
  } else if (role === roles.MANAGER) {
    const manager = await prisma.admin.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    if (manager?.department?.id) {
      where.items = {
        some: {
          OR: [{ assignedByAdminId: userId }, { assignedToAdminId: userId }],
        },
      };
    }
  } else if (role === roles.TECHNICIAN) {
    where.items = {
      some: {
        OR: [{ assignedByAdminId: userId }, { assignedToAdminId: userId }],
      },
    };
  } else if (role === roles.CUSTOMER) {
    where.OR = [
      { customerId: userId },
      {
        items: {
          some: {
            OR: [
              { assignedByCustomerId: userId },
              { assignedToCustomerId: userId },
            ],
          },
        },
      },
    ];
  }

  const last30DaysDate = subDays(new Date(), 30);
  const last7DaysDate = subDays(new Date(), 7);

  const [
    totalTickets,
    last30DaysTickets,
    last7DaysTickets,
    statusStats,
    ticketPriority,
    urgencyTickets,
    ticketsLast30Days,
  ] = await Promise.all([
    prisma.ticket.count({ where }),
    prisma.ticket.count({
      where: {
        ...where,
        createdAt: { gte: last30DaysDate },
      },
    }),
    prisma.ticket.count({
      where: {
        ...where,
        createdAt: { gte: last7DaysDate },
      },
    }),
    prisma.ticket.groupBy({
      by: ["status"],
      _count: { status: true },
      where,
    }),
    prisma.ticket.findMany({
      where,
      select: { priority: true },
    }),
    prisma.ticket.findMany({
      where,
      select: { urgencyLevel: true },
    }),
    prisma.ticket.findMany({
      where: { ...where, createdAt: { gte: last30DaysDate } },
      select: { createdAt: true },
    }),
  ]);

  const statusSummary = statusStats.reduce((acc, item) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {} as Record<string, number>);

  const prioritySummary = ticketPriority.reduce((acc, t) => {
    const key = t.priority ?? "LOW";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const urgencySummary = urgencyTickets.reduce((acc, t) => {
    const key = t.urgencyLevel ?? "UNASSIGNED";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // --- Trend (last 30 days by date) ---
  const today = new Date();
  const trendMap: Record<string, number> = {};

  for (let i = 0; i < 30; i++) {
    const d = subDays(today, i);
    const key = d.toISOString().split("T")[0] ?? ""; // YYYY-MM-DD
    trendMap[key] = 0;
  }

  ticketsLast30Days.forEach((t) => {
    const key = t.createdAt.toISOString().split("T")[0] ?? "";
    if (trendMap[key] !== undefined) {
      trendMap[key]++;
    }
  });

  const trend = Object.entries(trendMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  return {
    success: true,
    message: "Ticket stats fetched successfully",
    data: {
      totalTickets,
      last30Days: last30DaysTickets,
      last7Days: last7DaysTickets,
      status: statusSummary,
      priority: prioritySummary,
      urgency: urgencySummary,
      trend,
    },
  };
};

//get ticket by id,
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
      customer: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          phone: true,
          insuranceCompany: true,
          insuranceDeductable: true,
          isRoofCovered: true,
        },
      },
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

//create ticket item
export const createticketItemService = async (
  user: { id: string; role: string },
  data: CreateTicketItemInput
) => {
  const {
    ticketId,
    title,
    description,
    assignedToAdminId,
    assignedToCustomerId,
    assets,
  } = data;

  const assigner =
    (await prisma.admin.findUnique({
      where: { id: user.id },
      include: { department: true },
    })) || (await prisma.customer.findUnique({ where: { id: user.id } }));

  if (!assigner)
    throw new BadRequestError("Invalid user performing this action");

  let assignedByData: any = {};
  let isPublic = false;

  if ("role" in assigner) {
    assignedByData.assignedByRole = assigner.role;
    assignedByData.assignedByAdminId = assigner.id;

    if (assigner.role === AdminRole.MANAGER && assigner.department?.id) {
      assignedByData.assignedByDeptId = assigner.department.id;
    }
  } else {
    assignedByData.assignedByRole = "CUSTOMER";
    assignedByData.assignedByCustomerId = assigner.id;
    isPublic = true;
  }

  let assignedToData: any = {};

  if (!isPublic) {
    if (assignedToAdminId) {
      const admin = await prisma.admin.findUnique({
        where: { id: assignedToAdminId },
      });
      if (!admin) throw new BadRequestError("Assigned admin not found");

      assignedToData = {
        assignedToRole: admin.role,
        assignedToAdminId: admin.id,
      };
    } else if (assignedToCustomerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: assignedToCustomerId },
      });
      if (!customer) throw new BadRequestError("Assigned customer not found");

      assignedToData = {
        assignedToRole: "CUSTOMER",
        assignedToCustomerId: customer.id,
      };
    } else if (user.role === AdminRole.TECHNICIAN) {
      const technician = await prisma.admin.findUnique({
        where: { id: user.id },
        include: { department: true },
      });

      if (!technician?.department?.id)
        throw new BadRequestError(
          "Technician is not associated with any department"
        );

      assignedToData = {
        assignedToRole: AdminRole.TECHNICIAN,
        assignedToAdminId: assignedToAdminId,
      };
    } else {
      throw new Error("No valid assignment target provided");
    }
  }

  const ticketItem = await prisma.ticketItem.create({
    data: {
      ticketId,
      title,
      description,
      isPublic,
      ...assignedByData,
      ...assignedToData,
    },
  });

  if (assets?.length) {
    await prisma.ticketItemAsset.createMany({
      data: assets.map((asset) => ({
        ticketItemId: ticketItem.id,
        url: asset.url,
        type: getAssetTypeFromUrl(asset.url),
      })),
    });
  }

  // sender data
  const notificationSender: any = {
    role: user.role,
  };

  if (user.role === "CUSTOMER") {
    notificationSender.senderCustomerId = user.id;
  } else {
    notificationSender.senderAdminId = user.id;

    if (user.role === AdminRole.MANAGER) {
      const manager = await prisma.admin.findUnique({
        where: { id: user.id },
        include: { department: true },
      });

      if (manager?.department?.id) {
        notificationSender.senderDeptId = manager.department.id;
      }
    }
  }

  //receiver data
  const receivers: any[] = [];

  if (assignedToData.assignedToRole === "CUSTOMER") {
    receivers.push({
      role: "CUSTOMER",
      customerId: assignedToData.assignedToCustomerId,
    });
  } else if (user.role === "TECHNICIAN") {
    const technicianWithDept = await prisma.admin.findUnique({
      where: { id: user.id },
      include: { department: true },
    });

    if (!technicianWithDept?.department?.id) {
      throw new BadRequestError(
        "Technician is not associated with any department"
      );
    }

    receivers.push({
      role: "MANAGER",
      deptId: technicianWithDept.department.id,
    });
  } else {
    receivers.push({
      role: assignedToData.assignedToRole,
      adminId: assignedToData.assignedToAdminId,
      deptId: assignedToData.assignedToDeptId || undefined,
    });
  }

  await createNotificationService({
    title: `Ticket Update - ${title}`,
    description: `A ticket update has been assigned.`,
    notificationType: "TICKET",
    actionType: ActionType.NOTIFY,
    isPublic: true,
    data: {
      ticketId,
      ticketItemId: ticketItem.id,
    },
    sender: notificationSender,
    receivers,
  });

  return {
    success: true,
    message: "Ticket assigned successfully",
    data: ticketItem,
  };
};

export const updateTicketItemService = async (
  user: { id: string; role: string },
  ticketItemId: string,
  data: UpdateTicketItemInput
) => {
  const {
    title,
    description,
    assignedToAdminId,
    assignedToCustomerId,
    assets,
  } = data;

  const ticketItem = await prisma.ticketItem.findUnique({
    where: { id: ticketItemId },
  });

  if (!ticketItem) throw new BadRequestError("Ticket item not found");

  let assignedToData: any = {};

  if (assignedToAdminId) {
    const admin = await prisma.admin.findUnique({
      where: { id: assignedToAdminId },
    });
    if (!admin) throw new BadRequestError("Assigned admin not found");

    assignedToData = {
      assignedToRole: admin.role,
      assignedToAdminId: admin.id,
      assignedToCustomerId: undefined,
    };
  } else if (assignedToCustomerId) {
    const customer = await prisma.customer.findUnique({
      where: { id: assignedToCustomerId },
    });
    if (!customer) throw new BadRequestError("Assigned customer not found");

    assignedToData = {
      assignedToRole: "CUSTOMER",
      assignedToCustomerId: customer.id,
      assignedToAdminId: undefined,
    };
  }

  const updatedTicketItem = await prisma.ticketItem.update({
    where: { id: ticketItemId },
    data: {
      ...data,
      ...assignedToData,
    },
  });

  if (assets?.length) {
    await prisma.ticketItemAsset.deleteMany({
      where: { ticketItemId },
    });

    await prisma.ticketItemAsset.createMany({
      data: assets.map((asset) => ({
        ticketItemId,
        url: asset.url,
        type: getAssetTypeFromUrl(asset.url),
      })),
    });
  }

  const notificationSender: any = { role: user.role };

  if (user.role === "CUSTOMER") {
    notificationSender.senderCustomerId = user.id;
  } else {
    notificationSender.senderAdminId = user.id;
  }

  const receivers: any[] = [];
  if (assignedToData.assignedToRole === "CUSTOMER") {
    receivers.push({
      role: "CUSTOMER",
      customerId: assignedToData.assignedToCustomerId,
    });
  } else if (assignedToData.assignedToRole) {
    receivers.push({
      role: assignedToData.assignedToRole,
      adminId: assignedToData.assignedToAdminId,
    });
  }

  await createNotificationService({
    title: `Ticket Update - ${title || ticketItem.title}`,
    description: `The ticket item has been updated.`,
    notificationType: "TICKET",
    actionType: ActionType.NOTIFY,
    data: {
      ticketId: ticketItem.ticketId,
      ticketItemId: ticketItem.id,
    },
    sender: notificationSender,
    receivers,
  });

  return {
    success: true,
    message: "Ticket item updated successfully",
    data: updatedTicketItem,
  };
};

export const getTicketWithItemsService = async (
  user: { id: string; role: string },
  ticketId: string
) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
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
      urgencyLevel: true,
      createdAt: true,
      updatedAt: true,
      customer: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          phone: true,
          insuranceCompany: true,
          insuranceDeductable: true,
          isRoofCovered: true,
        },
      },
      assets: {
        select: {
          id: true,
          url: true,
          type: true,
        },
      },
      items: {
        select: {
          id: true,
          title: true,
          description: true,
          isPublic: true,
          assignedByRole: true,
          assignedByAdminId: true,
          assignedByAdmin: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          assignedByCustomerId: true,
          assignedByCustomer: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          assignedToRole: true,
          assignedToAdminId: true,
          assignedToAdmin: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          assignedToCustomerId: true,
          assignedToCustomer: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          createdAt: true,
          assets: {
            select: {
              id: true,
              url: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!ticket) throw new NotFoundError("Ticket not found");

  if ([roles.SUPERADMIN, roles.ASSISTANT].includes(user.role)) {
    return {
      success: true,
      message: "Ticket fetched successfully",
      data: ticket,
    };
  }

  let filteredItems = ticket.items;

  if (user.role) {
    filteredItems = ticket.items.filter(
      (item) =>
        item.assignedToAdminId === user.id ||
        item.assignedByAdminId === user.id ||
        item.isPublic
    );
  }

  if (user.role === "CUSTOMER") {
    filteredItems = ticket.items.filter(
      (item) =>
        item.assignedToCustomerId === user.id ||
        item.assignedByCustomerId === user.id ||
        item.isPublic
    );
  }

  return {
    success: true,
    message: "Ticket fetched successfully",
    data: {
      ...ticket,
      items: filteredItems,
    },
  };
};
