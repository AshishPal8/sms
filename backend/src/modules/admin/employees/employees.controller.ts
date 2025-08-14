import type { NextFunction, Request, Response } from "express";
import {
  addEmployeeService,
  deleteEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
} from "./employees.service";
import { BadRequestError, UnauthorizedError } from "../../../middlewares/error";
import { AdminRole } from "../../../generated/prisma";

export const getAllEmployees = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new UnauthorizedError("You are not authorized for this reqeust!");
    }

    const {
      search,
      sortBy,
      sortOrder,
      page = "1",
      limit = "10",
      role,
      isActive,
    } = req.query;

    const numericPage = parseInt(page as string, 10);
    const numericLimit = parseInt(limit as string, 10);
    const isActiveBoolean =
      isActive === "true" ? true : isActive === "false" ? false : undefined;

    const { employees, total } = await getAllEmployeesService({
      adminId,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
      page: numericPage,
      limit: numericLimit,
      role: role as string,
      isActive: isActiveBoolean,
    });
    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employees,
      meta: {
        total,
        page: numericPage,
        limit: numericLimit,
        totalPages: Math.ceil(total / numericLimit),
      },
    });
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

export const getEmployeeProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employeeId = req.user?.id;
    if (!employeeId) {
      throw new BadRequestError("Employee id is required");
    }

    const employee = await getEmployeeByIdService(employeeId);

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
