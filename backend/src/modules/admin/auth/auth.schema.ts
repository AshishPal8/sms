import { z } from "zod";
import { AdminRole } from "../../../generated/prisma";

export const adminSignupSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
  role: z.enum(AdminRole),
  phone: z.string().optional(),
  profilePicture: z.url().optional(),
});

export const adminSigninSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

export type AdminSignupInput = z.infer<typeof adminSignupSchema>;
export type AdminSigninInput = z.infer<typeof adminSigninSchema>;
