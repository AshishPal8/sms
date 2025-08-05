import { z } from "zod";
import { AdminRole } from "../../../generated/prisma";

export const addEmployeeSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
  role: z.enum(AdminRole),
  phone: z.string().optional(),
  profilePicture: z.url().optional(),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }).optional(),
  email: z.email({ error: "Invalid email" }).optional(),
  role: z.enum(AdminRole).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
  profilePicture: z.url().optional(),
});

export type addEmployeeInput = z.infer<typeof addEmployeeSchema>;
export type updateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
