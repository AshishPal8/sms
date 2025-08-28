import type { NextFunction, Request, Response } from "express";
import { signinService } from "./auth.service";
import { NotFoundError } from "../../middlewares/error";
import { clearAuthCookie } from "../../utils/cookieUtils";

export const signinController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await signinService(req.body);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signOutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      throw new NotFoundError("user already logout or not found");
    }

    clearAuthCookie(res);

    res
      .status(200)
      .json({ success: true, message: "Admin logout successfully" });
  } catch (error: any) {
    next(error);
  }
};
