import bcrypt from "bcryptjs";
import prisma from "../../../db";
import { BadRequestError } from "../../../middlewares/error";
import type { AdminSigninInput, AdminSignupInput } from "./auth.schema";
import { generateToken } from "../../../utils/auth";

export const adminSignupService = async (data: AdminSignupInput) => {
  const { name, email, password, phone, profilePicture, role } = data;

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin)
    throw new BadRequestError("Admin already exists with this email");

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      name,
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
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
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
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    token,
  };
};
