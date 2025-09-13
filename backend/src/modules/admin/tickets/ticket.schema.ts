import { z } from "zod";
import { phoneRegex } from "../../../utils/regex";
import {
  TicketPriority,
  TicketStatus,
  TicketUrgency,
} from "../../../generated/prisma";
import { isoDateOrDate } from "../../../utils/isoDateOrDate";

export const ticketAssetSchema = z.object({
  url: z.url("Invalid asset URL"),
});

export const addressSchema = z
  .object({
    houseNumber: z.string().optional(),
    locality: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  })
  .partial();

export const createTicketSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),

    firstname: z.string().optional(),
    lastname: z.string().optional(),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Enter a valid phone")
      .optional(),
    email: z.email("Enter a valid email").trim().optional(),
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

    priority: z.enum(TicketPriority).optional(),
    status: z.enum(TicketStatus).optional(),
    urgencyLevel: z.enum(TicketUrgency).optional(),
    assets: z.array(ticketAssetSchema).optional(),
  })
  .refine((v) => Boolean(v.email) || Boolean(v.phone), {
    path: ["email"],
    error: "Provide at least email or phone",
  })
  .transform((v) => ({
    ...v,
    email: v.email?.toLowerCase(),
    phone: v.phone?.replace(/\s+/g, ""),
  }));

export const updateTicketSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  address: addressSchema.optional(),
  priority: z.enum(TicketPriority).optional(),
  status: z.enum(TicketStatus).optional(),
  urgencyLevel: z.enum(TicketUrgency).optional(),
  assets: z.array(ticketAssetSchema).optional(),
});

export const createTicketItemSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"),

  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),

  assignedToAdminId: z.string().optional(),
  assignedToDeptId: z.string().optional(),
  assignedToCustomerId: z.string().optional(),

  assets: z.array(ticketAssetSchema).optional(),
});

export const updateTicketItemSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100)
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000)
    .optional(),
  assignedToAdminId: z.string().optional(),
  assignedToDeptId: z.string().optional(),
  assignedToCustomerId: z.string().optional(),
  assets: z.array(ticketAssetSchema).optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type CreateTicketItemInput = z.infer<typeof createTicketItemSchema>;
export type UpdateTicketItemInput = z.infer<typeof updateTicketItemSchema>;
