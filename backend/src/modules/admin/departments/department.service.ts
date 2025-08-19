import prisma from "../../../db";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import type { GetAllDepartmentOptions } from "../../../types/department.types";
import { roles } from "../../../utils/roles";
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
      admin: {
        select: {
          id: true,
          name: true,
        },
      },
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
      adminId: true,
      technicians: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
          role: true,
        },
      },
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!department) throw new NotFoundError("Department not found");

  return department;
};

export const addDepartmentService = async (data: createDepartmentInput) => {
  const { name, adminId, technicians, isActive } = data;

  const existingDepartment = await prisma.department.findFirst({
    where: { name },
  });

  if (existingDepartment) {
    throw new BadRequestError("Department already exists with this name");
  }

  if (adminId) {
    const existingManager = await prisma.department.findFirst({
      where: { adminId, isDeleted: false },
    });
    if (existingManager) {
      throw new BadRequestError(
        `Admin ID ${adminId} is already assigned to department ${existingManager.name}`
      );
    }
  }

  if (technicians.length > 0) {
    const technicianAdmins = await prisma.admin.findMany({
      where: {
        id: { in: technicians },
        role: "TECHNICIAN",
        isDeleted: false,
      },
    });

    if (technicianAdmins.length !== technicians.length) {
      throw new BadRequestError(
        "Some technician IDs are invalid or not TECHNICIAN role"
      );
    }

    const assignedTechnicians = await prisma.admin.findMany({
      where: {
        id: { in: technicians },
        departmentId: { not: null },
      },
    });
    if (assignedTechnicians.length > 0) {
      throw new BadRequestError(
        `Technicians ${assignedTechnicians
          .map((t) => t.id)
          .join(", ")} are already assigned to other departments`
      );
    }
  }

  const department = await prisma.department.create({
    data: {
      name,
      adminId: adminId ? adminId : null,
      isActive,
      technicians: {
        connect: technicians.map((id) => ({ id })),
      },
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
  const { name, adminId, technicians, isActive } = data;

  console.log("Data", data);

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

  if (technicians !== undefined) {
    if (technicians.length > 0) {
      const technicianAdmins = await prisma.admin.findMany({
        where: {
          id: { in: technicians },
          role: "TECHNICIAN",
          isDeleted: false,
        },
      });

      if (technicianAdmins.length !== technicians.length) {
        throw new BadRequestError(
          "Some technician IDs are invalid or not TECHNICIAN role"
        );
      }

      const assignedTechnicians = await prisma.admin.findMany({
        where: {
          id: { in: technicians },
          AND: [{ departmentId: { not: null } }, { departmentId: { not: id } }],
        },
      });

      if (assignedTechnicians.length > 0) {
        throw new BadRequestError(
          `Technicians ${assignedTechnicians
            .map((t) => t.id)
            .join(", ")} are already assigned to other departments`
        );
      }
    }
  }

  const department = await prisma.department.update({
    where: { id },
    data: {
      name,
      adminId: adminId ? adminId : null,
      technicians:
        technicians !== undefined
          ? { set: technicians.map((id) => ({ id })) }
          : undefined,
      isActive,
    },
  });

  console.log("Hello department", department);

  return {
    success: true,
    message: "Department updated Successfully",
    data: {
      id: department.id,
      name: department.name,
      adminId: department.adminId,
      isActive: department.isActive,
    },
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
