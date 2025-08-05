import type { NextFunction, Request, Response } from "express";
import { adminSigninService, adminSignupService } from "./auth.service";
import { NotFoundError } from "../../../middlewares/error";

export const adminSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const admin = await adminSignupService(req.body);

    res.cookie("token", admin.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      data: admin,
    });
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

    res.cookie("token", admin.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    res.status(200).json({
      success: true,
      message: "Signin successful",
      data: admin,
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      throw new NotFoundError("user already logout or not found");
    }

    res.clearCookie("token");

    res
      .status(200)
      .json({ success: true, message: "Admin logout successfully" });
  } catch (error: any) {
    next(error);
  }
};
