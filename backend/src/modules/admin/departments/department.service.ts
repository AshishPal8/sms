import prisma from "../../../db";
import { AdminRole } from "../../../generated/prisma";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import type { GetAllDepartmentOptions } from "../../../types/department.types";
import { roles } from "../../../utils/roles";
import type {
  createDepartmentInput,
  updateDepartmentInput,
} from "./department.schema";

export const getAllDepartmentsService = async (
  divisionId: string,
  {
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
    isActive,
    isDeleted,
  }: GetAllDepartmentOptions
) => {
  const whereClause: any = {
    isDeleted: false,
    divisionId,
  };

  if (search) {
    whereClause.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }

  if (typeof isActive === "boolean") {
    whereClause.isActive = isActive;
  }
  if (typeof isDeleted === "boolean") {
    whereClause.isDeleted = isDeleted;
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
      managers: {
        include: {
          admin: {
            select: { id: true, firstname: true, lastname: true },
          },
        },
      },
      technicians: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
      isActive: true,
      createdAt: true,
    },
  });

  const normalized = departments.map((dept) => {
    const managerAdminIds = (dept.managers || []).map((m) => m.admin.id);

    return {
      id: dept.id,
      name: dept.name,
      isActive: dept.isActive,
      createdAt: dept.createdAt,
      managers: (dept.managers || []).map((m) => ({
        id: m.admin.id,
        firstname: m.admin.firstname,
        lastname: m.admin.lastname,
      })),
      technicians: (dept.technicians || []).filter(
        (t) => !managerAdminIds.includes(t.id)
      ),
    };
  });

  return {
    success: true,
    message: "Department fetched successfully",
    data: normalized,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDepartmentsStatsService = async () => {
  const totalDepartments = await prisma.department.count({
    where: { isDeleted: false },
  });

  const newDepartmentssLast30Days = await prisma.department.count({
    where: {
      isDeleted: false,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });

  return {
    success: true,
    message: "Department stats fetched successfully",
    data: {
      totalDepartments,
      newDepartmentssLast30Days,
    },
  };
};

export const getActiveDepartmentsService = async () => {
  const departments = await prisma.department.findMany({
    where: { isActive: true, isDeleted: false },
    select: {
      id: true,
      name: true,
      managers: {
        include: {
          admin: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              profilePicture: true,
            },
          },
        },
      },
      technicians: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          profilePicture: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const normalized = departments.map((dept) => {
    const managerAdminIds = (dept.managers || []).map((m) => m.admin.id);

    return {
      id: dept.id,
      name: dept.name,
      managers: (dept.managers || []).map((m) => ({
        id: m.admin.id,
        firstname: m.admin.firstname,
        lastname: m.admin.lastname,
        email: m.admin.email,
        profilePicture: m.admin.profilePicture,
      })),
      technicians: (dept.technicians || []).filter(
        (t) => !managerAdminIds.includes(t.id)
      ),
    };
  });

  return {
    success: true,
    message: "Active department fetched successfully",
    data: normalized,
  };
};

export const getDepartmentByIdService = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      managers: {
        include: {
          admin: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              profilePicture: true,
              role: true,
            },
          },
        },
      },
      technicians: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          profilePicture: true,
          role: true,
          email: true,
        },
      },
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!department) throw new NotFoundError("Department not found");

  const managerAdminIds = (department.managers || []).map((m) => m.admin.id);

  const filteredTechnicians = (department.technicians || []).filter(
    (tech) => !managerAdminIds.includes(tech.id)
  );

  return {
    success: true,
    message: "Department fetched successfully",
    data: {
      id: department.id,
      name: department.name,
      isActive: department.isActive,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
      managers: (department.managers || []).map((m) => ({
        id: m.admin.id,
        firstname: m.admin.firstname,
        lastname: m.admin.lastname,
        email: m.admin.email,
        profilePicture: m.admin.profilePicture,
        role: m.admin.role,
      })),
      technicians: filteredTechnicians,
    },
  };
};

export const addDepartmentService = async (
  divisionId: string,
  data: createDepartmentInput
) => {
  const { name, managers, isActive } = data;

  const division = await prisma.division.findUnique({
    where: { id: divisionId },
    select: { id: true, isDeleted: true, name: true },
  });
  if (!division || division.isDeleted) {
    throw new BadRequestError("Provided division not found or is deleted");
  }

  const managerIds = Array.from(new Set(managers.filter(Boolean)));

  const existingDepartment = await prisma.department.findFirst({
    where: { name, isDeleted: false },
  });

  if (existingDepartment) {
    throw new BadRequestError("Department already exists with this name");
  }

  if (managerIds.length > 0) {
    const managerAdmins = await prisma.admin.findMany({
      where: { id: { in: managerIds }, isDeleted: false },
      select: { id: true, role: true, firstname: true, lastname: true },
    });

    if (managerAdmins.length !== managerIds.length) {
      const foundIds = new Set(managerAdmins.map((m) => m.id));
      const missing = managerIds.filter((id) => !foundIds.has(id));
      throw new BadRequestError(
        `Some manager IDs are invalid: ${missing.join(", ")}`
      );
    }

    const notManagers = managerAdmins.filter((m) => m.role !== "MANAGER");
    if (notManagers.length > 0) {
      throw new BadRequestError(
        `Some admins are not MANAGER role: ${notManagers
          .map((m) => m.firstname)
          .join(", ")}`
      );
    }
  }

  const created = await prisma.$transaction(async (tx) => {
    const dept = await tx.department.create({
      data: {
        name,
        isActive,
        divisionId,
        ...(managerIds.length > 0
          ? {
              managers: {
                create: managerIds.map((id) => ({
                  admin: { connect: { id } },
                })),
              },
            }
          : {}),
      },
    });

    return dept;
  });

  const deptWithRelations = await prisma.department.findUnique({
    where: { id: created.id },
    include: {
      division: {
        select: { id: true, name: true },
      },
      managers: {
        include: {
          admin: {
            select: { id: true, firstname: true, lastname: true, email: true },
          },
        },
      },
    },
  });

  return {
    id: deptWithRelations!.id,
    name: deptWithRelations!.name,
    isActive: deptWithRelations!.isActive,
    division: deptWithRelations!.division
      ? {
          id: deptWithRelations!.division.id,
          name: deptWithRelations!.division.name,
        }
      : null,
    managers: (deptWithRelations!.managers || []).map((md) => ({
      id: md.admin.id,
      firstname: md.admin.firstname,
      lastname: md.admin.lastname,
      email: md.admin.email,
    })),
  };
};

export const updateDepartmentService = async (
  id: string,
  data: updateDepartmentInput
) => {
  const { name, managers, isActive } = data;

  const currentDepartment = await prisma.department.findUnique({
    where: { id },
    include: {
      managers: { select: { adminId: true } },
      technicians: { select: { id: true } },
    },
  });

  if (!currentDepartment) {
    throw new BadRequestError("Department not found");
  }

  if (name && name !== currentDepartment.name) {
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

  const managerIds = managers
    ? Array.from(new Set(managers.filter(Boolean)))
    : undefined;

  if (managerIds && managerIds.length > 0) {
    const managerAdmins = await prisma.admin.findMany({
      where: { id: { in: managerIds }, isDeleted: false },
      select: {
        id: true,
        role: true,
        firstname: true,
        lastname: true,
        departmentId: true,
      },
    });

    if (managerAdmins.length !== managerIds.length) {
      const foundIds = new Set(managerAdmins.map((m) => m.id));
      const missing = managerIds.filter((id) => !foundIds.has(id));
      throw new BadRequestError(
        `Some manager IDs are invalid: ${missing.join(", ")}`
      );
    }

    const notManagers = managerAdmins.filter(
      (m) => m.role !== AdminRole.MANAGER
    );
    if (notManagers.length > 0) {
      throw new BadRequestError(
        `Some admins are not MANAGER role: ${notManagers
          .map((m) => m.firstname)
          .join(", ")}`
      );
    }
  }

  const updatedDept = await prisma.$transaction(async (tx) => {
    const dept = await tx.department.update({
      where: { id },
      data: {
        name: name ?? undefined,
        isActive: isActive ?? undefined,
      },
    });

    if (managerIds !== undefined) {
      await tx.managedDepartment.deleteMany({ where: { departmentId: id } });

      const createData = managerIds.map((mgrId) => ({
        adminId: mgrId,
        departmentId: id,
      }));

      if (managerIds.length > 0) {
        try {
          await tx.managedDepartment.createMany({
            data: createData,
          });
        } catch (error) {
          for (const mgrId of managerIds) {
            try {
              await tx.managedDepartment.create({
                data: {
                  admin: { connect: { id: mgrId } },
                  department: { connect: { id } },
                },
              });
            } catch (innerErr) {
              console.error(
                "create managedDepartment failed for",
                mgrId,
                innerErr
              );
            }
          }
        }
      }
    }

    return dept;
  });

  const deptWithRelations = await prisma.department.findUnique({
    where: { id: updatedDept.id },
    include: {
      managers: {
        include: {
          admin: {
            select: { id: true, firstname: true, lastname: true, email: true },
          },
        },
      },
    },
  });

  return {
    success: true,
    message: "Department updated Successfully",
    data: {
      id: deptWithRelations!.id,
      name: deptWithRelations!.name,
      isActive: deptWithRelations!.isActive,
      managers: (deptWithRelations!.managers || []).map((md) => ({
        id: md.admin.id,
        firstname: md.admin.firstname,
        lastname: md.admin.lastname,
        email: md.admin.email,
      })),
    },
  };
};

export const deleteDepartmentService = async (id: string) => {
  const existingDepartment = await prisma.department.findUnique({
    where: { id },
    include: {
      managers: { select: { adminId: true } },
      technicians: { select: { id: true } },
    },
  });

  if (!existingDepartment) {
    throw new NotFoundError("Department not found or already deleted!");
  }

  const managerAdminIds = (existingDepartment.managers || []).map(
    (m) => m.adminId
  );
  const technicianIds = (existingDepartment.technicians || []).map((t) => t.id);
  const adminIdsToClear = Array.from(
    new Set([...managerAdminIds, ...technicianIds])
  );

  await prisma.$transaction(async (tx) => {
    await tx.department.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
        technicians: { set: [] },
      },
    });

    await tx.managedDepartment.deleteMany({ where: { departmentId: id } });

    if (adminIdsToClear.length > 0) {
      await tx.admin.updateMany({
        where: { id: { in: adminIdsToClear } },
        data: { departmentId: null },
      });
    }
  });

  return {
    success: true,
    message: "Department deleted and associations cleared successfully.",
    data: {
      id,
    },
  };
};

export const getDepartmentEmployeesService = async (departmentId: string) => {
  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    select: {
      id: true,
      name: true,
      managers: {
        include: {
          admin: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              profilePicture: true,
              role: true,
              isActive: true,
              isDeleted: true,
            },
          },
        },
      },
    },
  });

  if (!department) throw new NotFoundError("Department not found");

  const managerIds = (department.managers || []).map((m) => m.admin.id);

  const deptAdmins = await prisma.admin.findMany({
    where: {
      departmentId,
      isDeleted: false,
      isActive: true,
      // include all admins in department (including managers) — we'll filter managers out later
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      profilePicture: true,
      role: true,
      managerId: true,
      isActive: true,
      isDeleted: true,
    },
  });

  const techsByManager: Record<string, Array<any>> = {};

  for (const a of deptAdmins) {
    // skip managers themselves (they appear in deptAdmins too)
    if (managerIds.includes(a.id)) continue;

    const key = a.managerId ?? "unassigned";
    if (!techsByManager[key]) techsByManager[key] = [];
    techsByManager[key].push({
      id: a.id,
      firstname: a.firstname,
      lastname: a.lastname,
      email: a.email,
      profilePicture: a.profilePicture,
      role: a.role,
      isActive: a.isActive,
    });
  }

  // build result: for each manager, attach their technicians (from group)
  const managersWithTechs = (department.managers || []).map((m) => {
    const mgr = m.admin;
    const managerTechs = techsByManager[mgr.id] || [];
    return {
      manager: {
        id: mgr.id,
        firstname: mgr.firstname,
        lastname: mgr.lastname,
        email: mgr.email,
        profilePicture: mgr.profilePicture,
        role: mgr.role as AdminRole,
        isActive: mgr.isActive,
      },
      assignedAt: m.assignedAt,
      technicians: managerTechs,
      technicianCount: managerTechs.length,
    };
  });

  return {
    success: true,
    message: "Department employees fetched",
    data: {
      department: {
        id: department.id,
        name: department.name,
      },
      managers: managersWithTechs,
      totalManagers: managersWithTechs.length,
      totalTechnicians: deptAdmins.filter((a) => !managerIds.includes(a.id))
        .length,
    },
  };
};
