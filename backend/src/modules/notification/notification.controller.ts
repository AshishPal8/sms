import type { NextFunction, Request, Response } from "express";
import {
  getNotificationsService,
  markNotificationAsReadService,
} from "./notification.service";
import { BadRequestError, UnauthorizedError } from "../../middlewares/error";

export const getNotificationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = req.user;

  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }
  const { id, role } = user;

  try {
    const notification = await getNotificationsService(id, role);

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsReadController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const notificationId = req.params.id;

    if (!notificationId) {
      throw new BadRequestError("Notification id is required");
    }
    const notification = await markNotificationAsReadService(notificationId);

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};
