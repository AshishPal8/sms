import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../../middlewares/error";
import {
  createDivisionService,
  deleteDivisionService,
  getActiveDivisionsService,
  getAllDivisionService,
  getDivisionByIdService,
  getDivisionStatsService,
  updateDivisionService,
} from "./divison.service";

export const getAllDivisionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      search,
      sortBy,
      sortOrder,
      page = "1",
      limit = "10",
      isActive,
    } = req.query;

    const numericPage = parseInt(page as string, 10);
    const numericLimit = parseInt(limit as string, 10);
    const isActiveBoolean =
      isActive === "true" ? true : isActive === "false" ? false : undefined;

    const divisions = await getAllDivisionService({
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
      page: numericPage,
      limit: numericLimit,
      isActive: isActiveBoolean,
    });

    res.status(200).json(divisions);
  } catch (err) {
    next(err);
  }
};

export const getActiveDivisionsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const divisions = await getActiveDivisionsService();
    res.status(200).json(divisions);
  } catch (err) {
    next(err);
  }
};

export const getDivisionStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const divisions = await getDivisionStatsService();
    res.status(200).json(divisions);
  } catch (err) {
    next(err);
  }
};

export const getDivisionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Division id is required");
    }

    const division = await getDivisionByIdService(id);
    res.status(200).json(division);
  } catch (err) {
    next(err);
  }
};

export const createDivisionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const division = await createDivisionService(req.body);

    res.status(201).json(division);
  } catch (error) {
    next(error);
  }
};

export const updateDivisionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Division id is required");
    }

    const division = await updateDivisionService(id, req.body);

    res.status(201).json({
      success: true,
      message: "Division updated successfully",
      data: division,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDivisionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Division id is required");
    }

    const deletedDivision = await deleteDivisionService(id);

    res.status(201).json(deletedDivision);
  } catch (error) {
    next(error);
  }
};
