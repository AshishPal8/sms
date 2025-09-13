import { z } from "zod";
import { addressSchema } from "../../../schemas/addressSchema";
import { isoDateOrDate } from "../../../utils/isoDateOrDate";

export const customerSignupSchema = z.object({
  firstname: z.string().min(1, { error: "First name is required" }),
  lastname: z.string().optional(),
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
  firstname: z.string().min(1, "First name cannot be empty").optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  profilePicture: z.url("Invalid URL").optional(),
  address: addressSchema.optional(),
  insuranceCompany: z.string().optional(),
  policyNumber: z.string().optional(),
  policyExpiryDate: isoDateOrDate,
  insuranceContactNo: z.string().optional(),
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
