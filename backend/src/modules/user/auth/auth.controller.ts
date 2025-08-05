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
