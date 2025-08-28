import type { NextFunction, Request, Response } from "express";
import { adminSigninService, adminSignupService } from "./auth.service";
import { NotFoundError } from "../../../middlewares/error";
import { clearAuthCookie, setAuthCookie } from "../../../utils/cookieUtils";

export const adminSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admin = await adminSignupService(req.body);

    //cookie set
    setAuthCookie(res, admin.token);

    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
};

export const adminSignin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admin = await adminSigninService(req.body);

    //cookie set
    setAuthCookie(res, admin.token);

    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};
