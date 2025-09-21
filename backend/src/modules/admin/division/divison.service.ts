import prisma from "../../../db";
import { AdminRole } from "../../../generated/prisma";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import type {
  DivisionNode,
  GetAllDivisonOptions,
} from "../../../types/division.types";
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
  isDeleted,
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
  if (typeof isDeleted === "boolean") {
    whereClause.isDeleted = isDeleted;
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

export const getDepartmentsByDivisionService = async (divisionId: string) => {
  const division = await prisma.division.findUnique({
    where: { id: divisionId, isActive: true, isDeleted: false },
    select: {
      id: true,
      name: true,
      departments: {
        where: { isActive: true, isDeleted: false },
        orderBy: { name: "asc" },
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
                  profilePicture: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!division) {
    return {
      success: false,
      message: "Division not found",
      data: null,
    };
  }

  const normalizedDepartments = division.departments.map((dept) => ({
    id: dept.id,
    name: dept.name,
    managers: (dept.managers || []).map((m) => ({
      id: m.admin.id,
      firstname: m.admin.firstname,
      lastname: m.admin.lastname,
      profilePicture: m.admin.profilePicture,
    })),
  }));

  return {
    success: true,
    message: "Division and departments fetched successfully",
    data: {
      division: {
        id: division.id,
        name: division.name,
      },
      departments: normalizedDepartments,
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

export const getDivTreeByUserService = async (user: {
  id: string;
  role: string;
}) => {
  const { id, role } = user;

  // Helper function to format admin data consistently
  const formatAdmin = (admin) => ({
    id: admin.id,
    name: `${admin.firstname || ""} ${admin.lastname || ""}`.trim(),
    role: admin.role || "ADMIN",
    email: admin.email ?? null,
    profilePicture: admin.profilePicture ?? null,
  });

  // SUPERADMIN & ASSISTANT: Get full organizational tree with SUPERADMIN as root
  if (role === AdminRole.SUPERADMIN || role === AdminRole.ASSISTANT) {
    // Step 1: Get the current superadmin user info to make them the root
    const superadmin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        profilePicture: true,
        role: true,
      },
    });

    if (!superadmin) {
      return {
        success: false,
        message: "Superadmin not found",
        data: null,
      };
    }

    // Step 2: Fetch all divisions with their departments and managers
    const divisions = await prisma.division.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        departments: {
          where: { isActive: true, isDeleted: false },
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            // Get managers through ManagedDepartment junction table
            managers: {
              select: {
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
          },
        },
      },
    });

    // Step 3: Fetch all technicians with their manager and department relationships
    const allTechnicians = await prisma.admin.findMany({
      where: {
        role: AdminRole.TECHNICIAN,
        isActive: true,
        isDeleted: false,
        managerId: { not: null }, // Only technicians with managers
        departmentId: { not: null }, // Only technicians assigned to departments
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        profilePicture: true,
        role: true,
        managerId: true,
        departmentId: true,
      },
      orderBy: { firstname: "asc" },
    });

    // Step 4: Build divisions tree structure
    const divisionsTree = divisions.map((division) => ({
      id: division.id,
      name: division.name,
      type: "division",
      departments: (division.departments || []).map((department) => ({
        id: department.id,
        name: department.name,
        type: "department",
        managers: (department.managers || []).map((managerRelation) => {
          const manager = managerRelation.admin;

          // Find technicians managed by this manager in this department
          const managerTechnicians = allTechnicians
            .filter(
              (tech) =>
                tech.managerId === manager.id &&
                tech.departmentId === department.id
            )
            .map((tech) => ({
              ...formatAdmin(tech),
              type: "technician",
            }));

          return {
            ...formatAdmin(manager),
            type: "manager",
            technicians: managerTechnicians,
          };
        }),
      })),
    }));

    // Step 5: Create the root tree with SUPERADMIN at the top
    const rootTree = {
      ...formatAdmin(superadmin),
      type: "superadmin",
      divisions: divisionsTree, // All divisions nested under SUPERADMIN
    };

    return {
      success: true,
      message: "Organizational tree with SUPERADMIN root fetched",
      data: rootTree, // Single root object
    };
  }

  // MANAGER: Get tree for departments they manage (no SUPERADMIN root needed)
  if (role === AdminRole.MANAGER) {
    const superadmin = await prisma.admin.findFirst({
      where: { role: AdminRole.SUPERADMIN, isActive: true, isDeleted: false },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        profilePicture: true,
        role: true,
      },
    });

    if (!superadmin) {
      return {
        success: false,
        message: "Superadmin not found",
        data: null,
      };
    }

    const manager = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        profilePicture: true,
        role: true,
        managedDepartments: {
          select: {
            department: {
              select: {
                id: true,
                name: true,
                division: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!manager) {
      return {
        success: false,
        message: "Manager not found",
        data: null,
      };
    }

    // Get technicians managed by this manager
    const managedTechnicians = await prisma.admin.findMany({
      where: {
        managerId: manager.id,
        role: AdminRole.TECHNICIAN,
        isActive: true,
        isDeleted: false,
        departmentId: { not: null },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        profilePicture: true,
        role: true,
        departmentId: true,
      },
      orderBy: { firstname: "asc" },
    });

    // Group departments by division
    const divisionMap = new Map();

    for (const managedDept of manager.managedDepartments) {
      const dept = managedDept.department;
      if (!dept) continue;

      const divisionId = dept.division.id;

      if (!divisionMap.has(divisionId)) {
        divisionMap.set(divisionId, {
          id: dept.division.id,
          name: dept.division.name,
          type: "division",
          departments: [],
        });
      }

      // Get technicians for this department
      const deptTechnicians = managedTechnicians
        .filter((tech) => tech.departmentId === dept.id)
        .map((tech) => ({
          ...formatAdmin(tech),
          type: "technician",
        }));

      const departmentNode = {
        id: dept.id,
        name: dept.name,
        type: "department",
        managers: [
          {
            ...formatAdmin(manager),
            type: "manager",
            technicians: deptTechnicians,
          },
        ],
      };

      divisionMap.get(divisionId).departments.push(departmentNode);
    }

    const divisions = Array.from(divisionMap.values());

    const root = {
      id: superadmin.id,
      name: `${superadmin.firstname || ""} ${superadmin.lastname || ""}`.trim(),
      role: "SUPERADMIN",
      email: superadmin.email || null,
      profilePicture: superadmin.profilePicture || null,
      type: "superadmin",
      divisions,
    };

    return {
      success: true,
      message: "Manager organizational tree fetched",
      data: root,
    };
  }

  // TECHNICIAN: Show their position in hierarchy
  if (role === AdminRole.TECHNICIAN) {
    const technician = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        profilePicture: true,
        role: true,
        manager: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            profilePicture: true,
            role: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
            division: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!technician || !technician.department) {
      return {
        success: true,
        message: "Technician has limited tree access",
        data: [],
      };
    }

    // Show technician's position in the org tree
    const tree = [
      {
        id: technician.department.division.id,
        name: technician.department.division.name,
        type: "division",
        departments: [
          {
            id: technician.department.id,
            name: technician.department.name,
            type: "department",
            managers: technician.manager
              ? [
                  {
                    ...formatAdmin(technician.manager),
                    type: "manager",
                    technicians: [
                      {
                        ...formatAdmin(technician),
                        type: "technician",
                      },
                    ],
                  },
                ]
              : [],
          },
        ],
      },
    ];

    return {
      success: true,
      message: "Technician organizational position",
      data: tree,
    };
  }

  return {
    success: false,
    message: "Unsupported role",
    data: null,
  };
};
