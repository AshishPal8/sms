import type { NextFunction, Request, Response } from "express";
import {
  customerSigninService,
  customerSignupService,
  resendOTPService,
  verifyOTPService,
} from "./auth.service";
import { generateToken } from "../../../utils/auth";

export const customerSignupController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customer = await customerSignupService(req.body);

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const customerSigninController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customer = await customerSigninService(req.body);

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customer = await verifyOTPService(req.body);

    const token = generateToken({
      id: customer.data.id,
      email: customer.data.email,
      role: "CUSTOMER",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      ...customer,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customer = await resendOTPService(req.body);

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

export const customerLogoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res
      .status(200)
      .json({ success: true, message: "Customer Logout Successfully" });
  } catch (error) {
    next(error);
  }
};
