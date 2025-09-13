import bcrypt from "bcryptjs";
import prisma from "../../../db";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import type { addEmployeeInput, updateEmployeeInput } from "./employees.schema";
import type { GetAllEmployeesOptions } from "../../../types/employees.types";
import { AdminRole } from "../../../generated/prisma";

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
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    message: "Employees fetched successfully",
    data: employees,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getEmployeeStatsService = async () => {
  const totalEmployees = await prisma.admin.count({
    where: { isDeleted: false },
  });

  const newEmployeesLast30Days = await prisma.admin.count({
    where: {
      isDeleted: false,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
  });

  const byRole = await prisma.admin.groupBy({
    by: ["role"],
    _count: { role: true },
    where: { isDeleted: false },
  });

  return {
    success: true,
    message: "Employee stats fetched successfully",
    data: {
      totalEmployees,
      newEmployeesLast30Days,
      byRole,
    },
  };
};

export const getEmployeesWithDepartmentIdService = async (
  deptId: string,
  role: AdminRole
) => {
  const employees = await prisma.admin.findMany({
    where: {
      role,
      departmentId: deptId,
    },
  });

  return {
    success: true,
    message: "Employees fetched successfully",
    data: employees,
  };
};

export const getEmployeeByIdService = async (id: string) => {
  const employee = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true,
      departmentId: true,
      department: {
        select: {
          id: true,
          divisionId: true,
        },
      },
      managerId: true,
      manager: {
        select: {
          id: true,
        },
      },
      managedDepartments: {
        select: {
          department: {
            select: {
              id: true,
              divisionId: true,
            },
          },
        },
        orderBy: { department: { name: "asc" } },
      },
    },
  });

  if (!employee) throw new NotFoundError("Employee not found");

  let departmentId: string | null = null;
  let divisionId: string | null = null;

  if (employee.departmentId) {
    departmentId = employee.departmentId;
    divisionId = employee.department?.divisionId ?? null;
  } else if (
    employee.managedDepartments &&
    employee.managedDepartments.length > 0
  ) {
    const firstManaged = employee.managedDepartments[0]?.department;
    departmentId = firstManaged?.id ?? null;
    divisionId = firstManaged?.divisionId ?? null;
  }

  const result = {
    id: employee.id,
    firstname: employee.firstname,
    lastname: employee.lastname,
    email: employee.email,
    role: employee.role,
    phone: employee.phone,
    isActive: employee.isActive,
    profilePicture: employee.profilePicture,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,

    // form-specific initial values
    divisionId,
    departmentId,
    managerId: employee.managerId ?? null,
  };

  return result;
};

export const addEmployeeService = async (data: addEmployeeInput) => {
  const {
    firstname,
    lastname,
    email,
    password,
    phone,
    profilePicture,
    role,
    departmentId,
    managerId,
  } = data;

  const existingByEmail = await prisma.admin.findUnique({
    where: { email },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  let existingPhoneEmployee = null;
  if (phone) {
    existingPhoneEmployee = await prisma.admin.findUnique({
      where: { phone },
    });
  }

  if (existingPhoneEmployee && !existingPhoneEmployee.isDeleted) {
    throw new BadRequestError("Employee already exists with this phone number");
  }

  const admin = await prisma.$transaction(async (tx) => {
    let createdAdmin;

    if (existingByEmail) {
      if (!existingByEmail.isDeleted) {
        throw new BadRequestError("Employee already exists with this email");
      }

      createdAdmin = await tx.admin.update({
        where: { email },
        data: {
          firstname: firstname.trim(),
          lastname: lastname?.trim(),
          phone: phone ?? null,
          password: hashedPassword,
          role,
          profilePicture: profilePicture ?? null,
          isDeleted: false,
        },
      });
    } else {
      createdAdmin = await tx.admin.create({
        data: {
          firstname: firstname.trim(),
          lastname: lastname?.trim(),
          email: email.trim(),
          phone: phone ?? null,
          password: hashedPassword,
          role,
          profilePicture: profilePicture ?? null,
        },
      });
    }

    if (role === AdminRole.MANAGER) {
      if (typeof departmentId !== "undefined" && departmentId !== null) {
        const dept = await tx.department.findUnique({
          where: { id: departmentId },
          select: { id: true, isDeleted: true },
        });
        if (!dept || dept.isDeleted) {
          throw new BadRequestError(
            "Provided department not found or is deleted"
          );
        }

        try {
          await tx.managedDepartment.create({
            data: {
              adminId: createdAdmin.id,
              departmentId: departmentId,
            },
          });
        } catch (error) {
          console.log("Cannot create managed department");
        }
      }
    }

    if (role === AdminRole.TECHNICIAN) {
      const updateData: Record<string, any> = {};

      if (typeof departmentId !== "undefined") {
        if (departmentId === null) {
          updateData.departmentId = null;
        } else {
          const dept = await tx.department.findUnique({
            where: { id: departmentId },
            select: { id: true, isDeleted: true },
          });
          if (!dept || dept.isDeleted) {
            throw new BadRequestError(
              "Provided department not found or is deleted"
            );
          }
          updateData.departmentId = departmentId;
        }
      }

      if (typeof managerId !== "undefined") {
        if (managerId === null) {
          updateData.managerId = null;
        } else {
          const mgr = await tx.admin.findUnique({
            where: { id: managerId },
            select: { id: true, role: true, isDeleted: true },
          });
          if (!mgr || mgr.isDeleted || mgr.role !== "MANAGER") {
            throw new BadRequestError(
              "Provided manager not found or not a MANAGER"
            );
          }

          const deptToCheck = updateData.departmentId ?? null;
          if (deptToCheck) {
            const manages = await tx.managedDepartment.findFirst({
              where: { adminId: managerId, departmentId: deptToCheck },
            });
            if (!manages) {
              throw new BadRequestError(
                "Provided manager does not manage the provided department"
              );
            }
          }

          updateData.managerId = managerId;
        }
      }
      if (Object.keys(updateData).length > 0) {
        createdAdmin = await tx.admin.update({
          where: { id: createdAdmin.id },
          data: updateData,
        });
      }
    }

    return createdAdmin;
  });

  return {
    id: admin.id,
    firstname: admin.firstname,
    lastname: admin.lastname,
    email: admin.email,
    role: admin.role,
    phone: admin.phone,
    profilePicture: admin.profilePicture,
    isActive: admin.isActive,
  };
};

export const updateEmployeeService = async (
  id: string,
  data: updateEmployeeInput
) => {
  const {
    firstname,
    lastname,
    email,
    password,
    phone,
    profilePicture,
    role,
    departmentId: managerDepartmentId,
    managerId: techManagerId,
  } = data;

  const existing = await prisma.admin.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Employee not found");

  if (email && email !== existing.email) {
    const other = await prisma.admin.findUnique({ where: { email } });
    if (other && !other.isDeleted)
      throw new BadRequestError(
        "Another active employee already uses this email"
      );
  }

  if (phone !== undefined && phone !== null && phone !== existing.phone) {
    const otherPhone = await prisma.admin.findUnique({ where: { phone } });
    if (otherPhone && otherPhone.id !== id && !otherPhone.isDeleted) {
      throw new BadRequestError(
        "Another active employee already uses this phone"
      );
    }
  }

  const updatePayload: Record<string, any> = {};
  if (typeof firstname !== "undefined")
    updatePayload.firstname = firstname?.trim();
  if (typeof lastname !== "undefined")
    updatePayload.lastname = lastname?.trim();
  if (typeof email !== "undefined") updatePayload.email = email?.trim();
  if (typeof profilePicture !== "undefined")
    updatePayload.profilePicture = profilePicture ?? null;
  if (typeof phone !== "undefined") updatePayload.phone = phone ?? null;
  if (typeof role !== "undefined") updatePayload.role = role;

  if (typeof password !== "undefined" && password !== null) {
    updatePayload.password = await bcrypt.hash(password, 10);
  }

  const updatedAdmin = await prisma.$transaction(async (tx) => {
    const admin = await tx.admin.update({ where: { id }, data: updatePayload });

    const effectiveRole = role ?? existing.role;

    if (
      effectiveRole === AdminRole.MANAGER &&
      data.hasOwnProperty("departmentId")
    ) {
      const depId = managerDepartmentId as string | null | undefined;

      if (depId === null) {
        await tx.managedDepartment.deleteMany({ where: { adminId: id } });
      } else if (typeof depId === "string") {
        const dept = await tx.department.findUnique({
          where: { id: depId },
          select: { id: true, isDeleted: true },
        });
        if (!dept || dept.isDeleted)
          throw new BadRequestError(
            "Provided department not found or is deleted"
          );

        await tx.managedDepartment.deleteMany({
          where: { adminId: id, departmentId: { not: depId } },
        });

        try {
          await tx.managedDepartment.create({
            data: { adminId: id, departmentId: depId },
          });
        } catch (err) {
          // ignore duplicate errors
        }
      }
    }

    if (effectiveRole === AdminRole.TECHNICIAN) {
      const techUpdate: Record<string, any> = {};

      if (data.hasOwnProperty("departmentId")) {
        const deptVal = (data as any).departmentId;

        if (deptVal === null) {
          techUpdate.departmentId = null;
        } else if (typeof deptVal === "string") {
          const dept = await tx.department.findUnique({
            where: { id: deptVal },
            select: { id: true, isDeleted: true },
          });
          if (!dept || dept.isDeleted)
            throw new BadRequestError("Department not found or is deleted");
          techUpdate.departmentId = deptVal;
        }
      }

      if (data.hasOwnProperty("managerId")) {
        const mgrVal = techManagerId as string | null | undefined;
        if (mgrVal === null) {
          techUpdate.managerId = null;
        } else if (typeof mgrVal === "string") {
          const mgr = await tx.admin.findUnique({
            where: { id: mgrVal },
            select: { id: true, role: true, isDeleted: true },
          });
          if (!mgr || mgr.isDeleted || mgr.role !== AdminRole.MANAGER)
            throw new BadRequestError(
              "Provided manager not found or not a MANAGER"
            );

          const deptToCheck = techUpdate.departmentId ?? admin.departmentId;
          if (deptToCheck) {
            const manages = await tx.managedDepartment.findFirst({
              where: { adminId: mgrVal, departmentId: deptToCheck },
            });
            if (!manages)
              throw new BadRequestError(
                "Provided manager does not manage the provided department"
              );
          }
          techUpdate.managerId = mgrVal;
        }
      }

      if (Object.keys(techUpdate).length > 0) {
        await tx.admin.update({ where: { id }, data: techUpdate });
      }
    }

    const fresh = await tx.admin.findUnique({ where: { id } });
    return fresh!;
  });

  return {
    id: updatedAdmin.id,
    firstname: updatedAdmin.firstname,
    lastname: updatedAdmin.lastname,
    email: updatedAdmin.email,
    role: updatedAdmin.role,
    phone: updatedAdmin.phone,
    profilePicture: updatedAdmin.profilePicture,
    isActive: updatedAdmin.isActive,
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
