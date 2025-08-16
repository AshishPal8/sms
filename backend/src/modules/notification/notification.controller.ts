import type { NextFunction, Request, Response } from "express";
import { getNotificationsService } from "./notification.service";
import { UnauthorizedError } from "../../middlewares/error";

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
