import bcrypt from "bcryptjs";
import prisma from "../../../db";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import type { addEmployeeInput, updateEmployeeInput } from "./employees.schema";
import { generateToken } from "../../../utils/auth";
import type { GetAllEmployeesOptions } from "../../../types/employees.types";

export const getAllEmployeesService = async ({
  adminId,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
  role,
  isActive,
}: GetAllEmployeesOptions) => {
  const whereClause: any = {
    id: { not: adminId },
    isDeleted: false,
  };

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role) {
    whereClause.role = role;
  }

  if (typeof isActive === "boolean") {
    whereClause.isActive = isActive;
  }

  const total = await prisma.admin.count({ where: whereClause });

  const employees = await prisma.admin.findMany({
    where: whereClause,
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  return { employees, total };
};

export const getEmployeeByIdService = async (id: string) => {
  const employee = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!employee) throw new NotFoundError("Employee not found");

  return employee;
};

export const addEmployeeService = async (data: addEmployeeInput) => {
  const { name, email, password, phone, profilePicture, role } = data;

  const existingEmployee = await prisma.admin.findUnique({
    where: { email },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (existingEmployee) {
    if (!existingEmployee.isDeleted) {
      throw new BadRequestError("Employee already exists with this email");
    }

    const updatedEmployee = await prisma.admin.update({
      where: { email },
      data: {
        name,
        phone: phone || null,
        password: hashedPassword,
        role,
        profilePicture,
        isDeleted: false,
      },
    });

    return {
      id: updatedEmployee.id,
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      role: updatedEmployee.role,
      phone: updatedEmployee.phone,
      profilePicture: updatedEmployee.profilePicture,
      isActive: updatedEmployee.isActive,
    };
  }

  const employee = await prisma.admin.create({
    data: {
      name,
      email: email,
      phone: phone || null,
      password: hashedPassword,
      role,
      profilePicture,
    },
  });

  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
    phone: employee.phone,
    profilePicture: employee.profilePicture,
    isActive: employee.isActive,
  };
};

export const updateEmployeeService = async (
  id: string,
  data: updateEmployeeInput
) => {
  const existingEmployee = await prisma.admin.findUnique({
    where: { id },
  });

  if (!existingEmployee) {
    throw new NotFoundError("Employee not found");
  }

  const updatedEmployee = await prisma.admin.update({
    where: { id },
    data,
  });

  return {
    id: updatedEmployee.id,
    name: updatedEmployee.name,
    email: updatedEmployee.email,
    role: updatedEmployee.role,
    phone: updatedEmployee.phone,
    profilePicture: updatedEmployee.profilePicture,
    isActive: updatedEmployee.isActive,
  };
};

export const deleteEmployeeService = async (id: string) => {
  const existingEmployee = await prisma.admin.findUnique({
    where: { id },
  });

  if (!existingEmployee) {
    throw new NotFoundError("Employee not found");
  }

  const deletedEmployee = await prisma.admin.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return {
    id: deletedEmployee.id,
  };
};
