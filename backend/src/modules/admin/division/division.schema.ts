import z from "zod";
import { objectIdRegex } from "../../../utils/regex";

export const createDivisionSchema = z.object({
  name: z.string().min(1, "Division name is required"),
  isActive: z.boolean().optional().default(true),

  departments: z
    .array(z.string().regex(objectIdRegex, "Invalid department id"))
    .optional(),
});

export const updateDivisionSchema = z.object({
  name: z.string().min(1).optional(),
  isActive: z.boolean().optional(),

  departments: z
    .array(z.string().regex(objectIdRegex, "Invalid department id"))
    .optional(),
});

export type CreateDivisionInput = z.infer<typeof createDivisionSchema>;
export type UpdateDivisonInput = z.infer<typeof updateDivisionSchema>;
