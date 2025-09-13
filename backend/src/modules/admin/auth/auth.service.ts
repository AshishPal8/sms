import bcrypt from "bcryptjs";
import prisma from "../../../db";
import { BadRequestError } from "../../../middlewares/error";
import type { AdminSigninInput, AdminSignupInput } from "./auth.schema";
import { generateToken } from "../../../utils/auth";

export const adminSignupService = async (data: AdminSignupInput) => {
  const { firstname, lastname, email, password, phone, profilePicture, role } =
    data;

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin)
    throw new BadRequestError("Admin already exists with this email");

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      firstname,
      lastname,
      email: email,
      phone: phone || null,
      password: hashedPassword,
      role,
      profilePicture,
    },
  });

  const token = generateToken({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });

  return {
    success: true,
    message: "Signup successful",
    action: "login_complete",
    data: {
      id: admin.id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      role: admin.role,
      departmentId: admin.departmentId,
    },
    token,
  };
};

export const adminSigninService = async (data: AdminSigninInput) => {
  const { email, password } = data;

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin)
    throw new BadRequestError("Admin does not exists with this email");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new BadRequestError("Incorrect credentials");

  const token = generateToken({
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });

  return {
    success: true,
    message: "Signin successful",
    action: "login_complete",
    data: {
      id: admin.id,
      firstname: admin.firstname,
      lastname: admin.lastname,
      profilePicture: admin.profilePicture,
      email: admin.email,
      role: admin.role,
      departmentId: admin.departmentId,
    },
    token,
  };
};
