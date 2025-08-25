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
  let deptId: string[] | undefined;

  if (role === roles.MANAGER) {
    const manager = await prisma.admin.findUnique({
      where: { id: userId },
      select: { department: { select: { id: true } } },
    });
    deptId = manager?.department?.id;
  }

  const receiverConditions: any[] = [];

  if (role === roles.CUSTOMER) {
    receiverConditions.push({ receiverCustomerId: userId });
  }

  if (
    role === roles.SUPERADMIN ||
    role === roles.ASSISTANT ||
    role === roles.TECHNICIAN
  ) {
    receiverConditions.push({ receiverAdminId: userId });
  }

  if (role === roles.MANAGER) {
    receiverConditions.push({ receiverDeptId: deptId });
  }

  if (receiverConditions.length === 0) {
    return [];
  }

  const notifications = await prisma.notification.findMany({
    where: {
      receivers: {
        some: {
          OR: receiverConditions,
        },
      },
    },
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
  });

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
