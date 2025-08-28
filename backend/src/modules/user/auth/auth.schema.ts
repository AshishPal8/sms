import { z } from "zod";

export const customerSignupSchema = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  email: z.email({ error: "Invalid email" }),
});

export const customerSigninSchema = z.object({
  email: z.email({ error: "Invalid email" }),
});

export const verifyOtpSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  otp: z.string().min(6, { error: "Otp must be at least 6 charactors" }),
  action: z.enum(["signup", "signin"]),
});

export const resendOtpSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  action: z.enum(["signup", "signin"]),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1, "Name cannot be empty").optional(),
  phone: z.string().optional(),
  profilePicture: z.url("Invalid URL").optional(),
  address: z.string().optional(),
  insuranceCompany: z.string().optional(),
  insuranceDeductable: z
    .number()
    .min(0, "Deductable cannot be negative")
    .optional(),
  isRoofCovered: z.boolean().default(false).optional(),
});

export type customerSignupInput = z.infer<typeof customerSignupSchema>;
export type customerSigninInput = z.infer<typeof customerSigninSchema>;
export type verifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type resendOtpInput = z.infer<typeof resendOtpSchema>;
export type updateCustomerInput = z.infer<typeof updateCustomerSchema>;
