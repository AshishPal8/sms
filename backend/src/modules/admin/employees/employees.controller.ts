import type { NextFunction, Request, Response } from "express";
import {
  addEmployeeService,
  deleteEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  getEmployeeStatsService,
  getEmployeesWithDepartmentIdService,
  updateEmployeeService,
} from "./employees.service";
import { BadRequestError, UnauthorizedError } from "../../../middlewares/error";
import type { AdminRole } from "../../../generated/prisma";

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError("You are not authorized for this reqeust!");
    }

    const {
      search,
      sortBy,
      sortOrder,
      page = "1",
      limit = "10",
      role,
      managerId,
      active,
      deleted,
    } = req.query;

    console.log("Is deleted", deleted);

    const numericPage = parseInt(page as string, 10);
    const numericLimit = parseInt(limit as string, 10);
    const isActiveBoolean =
      active === "true" ? true : active === "false" ? false : undefined;
    const isDeletedBoolean =
      deleted === "true" ? true : deleted === "false" ? false : undefined;

    const employees = await getAllEmployeesService(user, {
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
      page: numericPage,
      limit: numericLimit,
      role: role as string,
      managerId: managerId as string,
      isActive: isActiveBoolean,
      isDeleted: isDeletedBoolean,
    });

    res.status(200).json(employees);
  } catch (err) {
    next(err);
  }
};

export const getEmployeeStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employees = await getEmployeeStatsService();
    res.status(200).json(employees);
  } catch (err) {
    next(err);
  }
};

export const getEmployeeById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Employee id is required");
    }

    const employee = await getEmployeeByIdService(id);
    res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      data: employee,
    });
  } catch (err) {
    next(err);
  }
};

export const getEmployeesWithDepartmentIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deptId = req.params.id;
    const role = req.query.role;
    if (!deptId || !role) {
      throw new BadRequestError("Department or role is required");
    }

    const employees = await getEmployeesWithDepartmentIdService(
      deptId,
      role as AdminRole
    );
    res.status(200).json(employees);
  } catch (err) {
    next(err);
  }
};

export const getEmployeeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      throw new BadRequestError("Employee id is required");
    }

    const employee = await getEmployeeByIdService(user.id);

    res.status(201).json({
      success: true,
      message: "Employee profile fetched successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const addEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employee = await addEmployeeService(req.body);

    res.status(201).json({
      success: true,
      message: "Employee added successful",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Employee id is required");
    }

    const employee = await updateEmployeeService(id, req.body);

    res.status(201).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Employee id is required");
    }

    const deletedEmployee = await deleteEmployeeService(id);

    res.status(201).json({
      success: true,
      message: "Employee deleted successfully",
      data: deletedEmployee,
    });
  } catch (error) {
    next(error);
  }
};
