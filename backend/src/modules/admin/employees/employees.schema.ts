import { z } from "zod";
import { AdminRole } from "../../../generated/prisma";

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
});

export const updateEmployeeSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }).optional(),
  email: z.email({ error: "Invalid email" }).optional(),
  role: z.enum(AdminRole).optional(),
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
});

export type addEmployeeInput = z.infer<typeof addEmployeeSchema>;
export type updateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
