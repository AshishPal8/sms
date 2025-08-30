import prisma from "../../db";
import type { AssignmentRole } from "../../generated/prisma";
import { NotFoundError } from "../../middlewares/error";
import { roles } from "../../utils/roles";
import type { CreateNotificationInput } from "./notification.schema";

export const createNotificationService = async (
  data: CreateNotificationInput
) => {
  return prisma.$transaction(async (tx) => {
    const notification = await tx.notification.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        notificationType: data.notificationType,
        actionType: data.actionType,
        isPublic: data.isPublic,
        data: data.data ?? {},
        senderRole: data.sender.role as AssignmentRole,
        ...(data.sender.adminId && { senderAdminId: data.sender.adminId }),
        ...(data.sender.customerId && {
          senderCustomerId: data.sender.customerId,
        }),
        ...(data.sender.deptId && { senderDeptId: data.sender.deptId }),
      },
      select: { id: true, title: true },
    });

    const receiverData = data.receivers.map((receiver) => {
      const base: {
        notificationId: string;
        receiverRole: AssignmentRole;
        receiverAdminId?: string;
        receiverCustomerId?: string;
        receiverDeptId?: string;
      } = {
        notificationId: notification.id,
        receiverRole: receiver.role,
      };
      if (receiver.adminId) base.receiverAdminId = receiver.adminId;
      if (receiver.customerId) base.receiverCustomerId = receiver.customerId;
      if (receiver.deptId) base.receiverDeptId = receiver.deptId;
      return base;
    });

    await tx.notificationReceiver.createMany({
      data: receiverData,
    });

    return notification;
  });
};

export const getNotificationsService = async (
  userId: string,
  role: AssignmentRole
) => {
  let deptId: string | undefined;

  if ([roles.MANAGER, roles.TECHNICIAN].includes(role)) {
    const admin = await prisma.admin.findUnique({
      where: { id: userId },
      select: { department: { select: { id: true } } },
    });
    deptId = admin?.department?.id;
  }

  if ([roles.SUPERADMIN, roles.ASSISTANT].includes(role)) {
    const notifications = await prisma.notification.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        notificationType: true,
        actionType: true,
        data: true,
        createdAt: true,
        senderRole: true,
        senderAdminId: true,
        senderCustomerId: true,
        senderDeptId: true,
        isRead: true,
        receivers: {
          select: {
            receiverRole: true,
            receiverAdminId: true,
            receiverCustomerId: true,
            receiverDeptId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      message: "Notifications fetched successfully",
      data: notifications,
    };
  }

  const userTickets = await prisma.ticket.findMany({
    where: {
      isDeleted: false,
      OR: [
        role === roles.TECHNICIAN
          ? { items: { some: { assignedToAdminId: userId } } }
          : undefined,
        role === roles.TECHNICIAN
          ? { items: { some: { assignedByAdminId: userId } } }
          : undefined,
        role === roles.MANAGER && deptId
          ? { items: { some: { assignedToDeptId: deptId } } }
          : undefined,
        role === roles.MANAGER && deptId
          ? { items: { some: { assignedByDeptId: deptId } } }
          : undefined,
        role === roles.CUSTOMER
          ? { items: { some: { assignedToCustomerId: userId } } }
          : undefined,
        role === roles.CUSTOMER
          ? { items: { some: { assignedByCustomerId: userId } } }
          : undefined,
      ].filter(Boolean),
    },
    select: { id: true },
  });

  const ticketIds = userTickets.map((t) => t.id);

  const whereConditions: any[] = [];

  // STEP 2: Build conditions for notifications
  const receiverConditions: any[] = [];

  if (role === roles.CUSTOMER) {
    receiverConditions.push({ receiverCustomerId: userId });
  }

  if ([roles.TECHNICIAN].includes(role)) {
    receiverConditions.push({ receiverAdminId: userId });
  }

  if (role === roles.MANAGER && deptId) {
    receiverConditions.push({ receiverDeptId: deptId });
  }

  if (receiverConditions.length > 0) {
    whereConditions.push({ receivers: { some: { OR: receiverConditions } } });
  }

  if (ticketIds.length > 0) {
    whereConditions.push({
      AND: [{ isPublic: true }, { notificationType: "TICKET_ITEM" }],
    });
  }

  let notifications = await prisma.notification.findMany({
    where: {
      OR: whereConditions,
    },
    select: {
      id: true,
      title: true,
      description: true,
      isPublic: true,
      notificationType: true,
      actionType: true,
      data: true,
      createdAt: true,
      senderRole: true,
      senderAdminId: true,
      senderCustomerId: true,
      senderDeptId: true,
      isRead: true,
      receivers: {
        select: {
          receiverRole: true,
          receiverAdminId: true,
          receiverCustomerId: true,
          receiverDeptId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (ticketIds.length > 0) {
    notifications = notifications.filter((n) => {
      const ticketId = n.data?.ticketId;
      return !n.isPublic || (ticketId && ticketIds.includes(ticketId));
    });
  }

  return {
    success: true,
    message: "Notifications fetched successfully",
    data: notifications,
  };
};

export const markNotificationAsReadService = async (notificationId: string) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return {
    success: true,
    message: "Notification marked as read successfully",
    data: {
      id: updatedNotification.id,
      isRead: updatedNotification.isRead,
    },
  };
};
