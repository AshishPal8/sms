import type { NextFunction, Request, Response } from "express";
import { getSettingsService, updateSettingsService } from "./settings.service";

export const updateSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await updateSettingsService(req.body);
    res.status(201).json(settings);
  } catch (err) {
    next(err);
  }
};

export const getSettingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await getSettingsService();
    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
};
