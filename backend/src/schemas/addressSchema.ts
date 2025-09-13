import z from "zod";

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
