import z from "zod";
import { addressSchema } from "../../../schemas/addressSchema";
import { isoDateOrDate } from "../../../utils/isoDateOrDate";

export const createTicketSchema = z.object({
  title: z.string().min(3, { error: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  phone: z.string().optional(),
  address: addressSchema.optional(),
  assets: z
    .array(
      z.object({
        url: z.url({ error: "Invalid Url" }),
      })
    )
    .optional(),
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

export const updateTicketSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  address: addressSchema.optional(),
  assets: z
    .array(
      z.object({
        url: z.url({ error: "Invalid Url" }),
      })
    )
    .optional(),
});

export const createTicketItemSchema = z.object({
  title: z.string().min(3, { error: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  assets: z
    .array(
      z.object({
        url: z.url({ error: "Invalid Url" }),
      })
    )
    .optional(),
});

export type createTicketInput = z.infer<typeof createTicketSchema>;
export type updateTicketInput = z.infer<typeof updateTicketSchema>;

export type createTicketItemInput = z.infer<typeof createTicketItemSchema>;
