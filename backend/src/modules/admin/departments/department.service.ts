import prisma from "../../../db";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import type { GetAllDepartmentOptions } from "../../../types/department.types";
import type {
  createDepartmentInput,
  updateDepartmentInput,
} from "./department.schema";

export const getAllDepartmentsService = async ({
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
  isActive,
}: GetAllDepartmentOptions) => {
  const whereClause: any = {
    isDeleted: false,
  };

  if (search) {
    whereClause.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }

  if (typeof isActive === "boolean") {
    whereClause.isActive = isActive;
  }

  const total = await prisma.department.count({ where: whereClause });

  const departments = await prisma.department.findMany({
    where: whereClause,
    orderBy: { [sortBy]: sortOrder },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
    },
  });

  return { departments, total };
};

export const getDepartmentByIdService = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!department) throw new NotFoundError("Department not found");

  return department;
};

export const addDepartmentService = async (data: createDepartmentInput) => {
  const { name, adminId, isActive } = data;

  const existingDepartment = await prisma.department.findFirst({
    where: { name },
  });

  if (existingDepartment) {
    throw new BadRequestError("Department already exists with this name");
  }

  const department = await prisma.department.create({
    data: {
      name,
      adminId,
      isActive,
    },
  });

  return {
    id: department.id,
    name: department.name,
    isActive: department.isActive,
  };
};

export const updateDepartmentService = async (
  id: string,
  data: updateDepartmentInput
) => {
  const { name, adminId, isActive } = data;

  if (name) {
    const existingDepartment = await prisma.department.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });

    if (existingDepartment) {
      throw new BadRequestError("Department already exists with this name");
    }
  }

  const department = await prisma.department.update({
    where: { id },
    data: {
      name,
      adminId,
      isActive,
    },
  });

  return {
    id: department.id,
    name: department.name,
    isActive: department.isActive,
  };
};

export const deleteDepartmentService = async (id: string) => {
  const existingDepartment = await prisma.department.findUnique({
    where: { id },
  });

  if (!existingDepartment) {
    throw new NotFoundError("Department not found or already deleted!");
  }

  const deletedDepartent = await prisma.department.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });

  return {
    id: deletedDepartent.id,
  };
};
