import type { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../../../middlewares/error";
import {
  addDepartmentService,
  deleteDepartmentService,
  getActiveDepartmentsService,
  getAllDepartmentsService,
  getDepartmentByIdService,
  updateDepartmentService,
} from "./department.service";

export const getAllDepartmentController = async (
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

    const departments = await getAllDepartmentsService({
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
      page: numericPage,
      limit: numericLimit,
      isActive: isActiveBoolean,
    });

    res.status(200).json(departments);
  } catch (err) {
    next(err);
  }
};

export const getActiveDepartmentsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departments = await getActiveDepartmentsService();
    res.status(200).json(departments);
  } catch (err) {
    next(err);
  }
};

export const getDepartmentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Department id is required");
    }

    const department = await getDepartmentByIdService(id);
    res.status(200).json({
      success: true,
      message: "Department fetched successfully",
      data: department,
    });
  } catch (err) {
    next(err);
  }
};

export const addDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const department = await addDepartmentService(req.body);

    res.status(201).json(department);
  } catch (error) {
    next(error);
  }
};

export const updateDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Department id is required");
    }

    const department = await updateDepartmentService(id, req.body);

    res.status(201).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartmentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Department id is required");
    }

    const deletedDepartment = await deleteDepartmentService(id);

    res.status(201).json(deletedDepartment);
  } catch (error) {
    next(error);
  }
};
