import type { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../../../middlewares/error";
import {
  createDivisionService,
  deleteDivisionService,
  getActiveDivisionsService,
  getAllDivisionService,
  getDepartmentsByDivisionService,
  getDivisionByIdService,
  getDivisionStatsService,
  getDivTreeByUserService,
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
      active,
      deleted,
    } = req.query;

    const numericPage = parseInt(page as string, 10);
    const numericLimit = parseInt(limit as string, 10);
    const isActiveBoolean =
      active === "true" ? true : active === "false" ? false : undefined;
    const isDeletedBoolean =
      deleted === "true" ? true : deleted === "false" ? false : undefined;

    const divisions = await getAllDivisionService({
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
      page: numericPage,
      limit: numericLimit,
      isActive: isActiveBoolean,
      isDeleted: isDeletedBoolean,
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

export const getDepartmentsByDivisionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { divisionId } = req.params;
    if (!divisionId) {
      throw new BadRequestError("Divison is required!");
    }
    const departments = await getDepartmentsByDivisionService(divisionId);
    res.status(200).json(departments);
  } catch (err) {
    next(err);
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

export const getDivTreeByUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  try {
    const divisions = await getDivTreeByUserService(user);
    res.status(200).json(divisions);
  } catch (err) {
    next(err);
  }
};
