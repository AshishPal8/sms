import type { NextFunction, Request, Response } from "express";
import { signinService } from "./auth.service";

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
