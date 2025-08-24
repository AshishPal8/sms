import { z } from "zod";

const objectIdRegex = /^[a-f\d]{24}$/i;

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Department name must be at least 2 characters" })
    .max(50, { error: "Department name must be at most 50 characters" }),
  adminId: z
    .string()
    .regex(objectIdRegex, "Invalid admin ID")
    .or(z.literal(""))
    .nullable()
    .optional(),
  technicians: z
    .array(z.string().regex(objectIdRegex, "Invalid technician ID"))
    .optional()
    .default([]),
  isActive: z.boolean().optional(),
});

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Department name must be at least 2 characters" })
    .max(50, { error: "Department name must be at most 50 characters" })
    .optional(),
  adminId: z
    .string()
    .regex(objectIdRegex, "Invalid admin ID")
    .or(z.literal(""))
    .nullable()
    .optional(),
  technicians: z
    .array(z.string().regex(objectIdRegex, "Invalid technician ID"))
    .optional(),
  isActive: z.boolean().optional(),
});

export type createDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type updateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
