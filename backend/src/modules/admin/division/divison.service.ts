import prisma from "../../../db";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import type { GetAllDivisonOptions } from "../../../types/division.types";
import type {
  CreateDivisionInput,
  UpdateDivisonInput,
} from "./division.schema";

export const createDivisionService = async (data: CreateDivisionInput) => {
  const { name, isActive } = data;

  if (!name || name.trim().length === 0) {
    throw new BadRequestError("Division name is required");
  }

  const normalizedName = name.trim();

  const existingByName = await prisma.division.findFirst({
    where: { name: normalizedName },
    select: { id: true, name: true, isDeleted: true },
  });

  if (existingByName && !existingByName.isDeleted) {
    throw new BadRequestError(
      `Division with name "${normalizedName}" already exists`
    );
  }

  const division = await prisma.division.create({
    data: { name: name.trim(), isActive },
  });

  return {
    success: true,
    message: "Division created successfully",
    data: division,
  };
};

export const updateDivisionService = async (
  divisionId: string,
  data: UpdateDivisonInput
) => {
  const { name, isActive } = data;

  const existingDivision = await prisma.division.findUnique({
    where: { id: divisionId },
  });

  if (!existingDivision || existingDivision.isDeleted) {
    throw new BadRequestError("Division not found");
  }

  const updateData: Record<string, any> = {};

  if (typeof name !== "undefined") {
    const normalizedName = name?.trim();
    if (!normalizedName || normalizedName.length === 0) {
      throw new BadRequestError("Division name is required");
    }

    const conflict = await prisma.division.findFirst({
      where: {
        name: normalizedName,
        isDeleted: false,
        id: { not: divisionId },
      },
      select: { id: true, name: true, isDeleted: true },
    });

    if (conflict) {
      throw new BadRequestError(
        `Division with name "${normalizedName}" already exists`
      );
    }

    updateData.name = normalizedName;
  }

  if (typeof isActive !== "undefined") {
    updateData.isActive = isActive;
  }

  if (Object.keys(updateData).length === 0) {
    return {
      success: true,
      message: "No changes provided",
      data: existingDivision,
    };
  }

  const updated = await prisma.division.update({
    where: { id: divisionId },
    data: updateData,
  });

  return {
    success: true,
    message: "Division udpated successfully",
    data: updated,
  };
};

export const getAllDivisionService = async ({
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  page = 1,
  limit = 10,
  isActive,
}: GetAllDivisonOptions) => {
  const whereClause: any = {
    isDeleted: false,
  };

  if (search) {
    whereClause.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }

  if (typeof isActive === "boolean") {
    whereClause.isActive = isActive;
  }

  const total = await prisma.division.count({ where: whereClause });

  const divisions = await prisma.division.findMany({
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

  return {
    success: true,
    message: "Divison fetched successfully",
    data: divisions,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDivisionStatsService = async () => {
  const totalDivisons = await prisma.division.count({
    where: { isDeleted: false },
  });

  const newDivisionsLast30Days = await prisma.division.count({
    where: {
      isDeleted: false,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });

  return {
    success: true,
    message: "Division stats fetched successfully",
    data: {
      totalDivisons,
      newDivisionsLast30Days,
    },
  };
};

export const getActiveDivisionsService = async () => {
  const divisons = await prisma.division.findMany({
    where: { isActive: true, isDeleted: false },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return {
    success: true,
    message: "Active divisons fetched successfully",
    data: divisons,
  };
};

export const getDivisionByIdService = async (id: string) => {
  const division = await prisma.division.findUnique({
    where: { id, isDeleted: false },
    include: {
      departments: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!division) throw new NotFoundError("Divison not found");

  return {
    success: true,
    message: "Department fetched successfully",
    data: {
      id: division.id,
      name: division.name,
      isActive: division.isActive,
      departments: division.departments.map((department) => ({
        id: department.id,
        name: department.name,
      })),
      createdAt: division.createdAt,
      updatedAt: division.updatedAt,
    },
  };
};

export const deleteDivisionService = async (id: string) => {
  const existingDivision = await prisma.division.findUnique({
    where: { id },
  });

  if (!existingDivision) {
    throw new NotFoundError("Division not found or already deleted!");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.department.updateMany({
      where: { divisionId: id },
      data: { divisionId: undefined },
    });

    const deleted = await tx.division.update({
      where: { id: id },
      data: { isDeleted: true, isActive: false },
    });

    return deleted;
  });

  return {
    success: true,
    message: "Division deleted and associations cleared successfully.",
    data: {
      id: result.id,
    },
  };
};
