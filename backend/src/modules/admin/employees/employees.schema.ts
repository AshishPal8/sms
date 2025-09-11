import { z } from "zod";
import { AdminRole } from "../../../generated/prisma";
import { objectIdRegex } from "../../../utils/regex";

export const addEmployeeSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
  role: z.enum(AdminRole),
  phone: z
    .string()
    .min(10, { error: "Phone must be of 10 charactors" })
    .optional(),
  profilePicture: z
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  departmentId: z
    .string()
    .regex(objectIdRegex, "Invalid department ID")
    .nullable()
    .optional(),
  managerId: z
    .string()
    .regex(objectIdRegex, "Invalid manager ID")
    .nullable()
    .optional(),
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }).optional(),
  email: z.email({ error: "Invalid email" }).optional(),
  role: z.enum(AdminRole).optional(),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" })
    .optional(),
  phone: z
    .string()
    .min(10, { error: "Phone must be of 10 charactors" })
    .optional(),
  isActive: z.boolean().optional(),
  profilePicture: z
    .url({ message: "Invalid URL" })
    .optional()
    .or(z.literal(""))
    .or(z.null()),
  departmentId: z
    .string()
    .regex(objectIdRegex, "Invalid department ID")
    .nullable()
    .optional(),
  managerId: z
    .string()
    .regex(objectIdRegex, "Invalid manager ID")
    .nullable()
    .optional(),
});

export type addEmployeeInput = z.infer<typeof addEmployeeSchema>;
export type updateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
