import type { NextFunction, Request, Response } from "express";
import {
  signinService,
  customerSignupService,
  resendOTPService,
  verifyOTPService,
  getCustomerService,
  updateCustomerService,
} from "./auth.service";
import { generateToken } from "../../../utils/auth";
import { clearAuthCookie, setAuthCookie } from "../../../utils/cookieUtils";
import { BadRequestError } from "../../../middlewares/error";

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
    const customer = await signinService(req.body);

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

    setAuthCookie(res, token);

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
    clearAuthCookie(res);

    res
      .status(200)
      .json({ success: true, message: "Customer Logout Successfully" });
  } catch (error) {
    next(error);
  }
};

export const getCustomerProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      throw new BadRequestError("Customer id is required");
    }

    const customer = await getCustomerService(customerId);

    res.status(200).json({
      success: true,
      message: "Customer profile fetched successfully",
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCustomerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      throw new BadRequestError("Customer id is required");
    }

    const customer = await updateCustomerService(customerId, req.body);

    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};
