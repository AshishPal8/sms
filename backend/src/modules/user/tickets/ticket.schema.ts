import z from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(3, { error: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  address: z.string().optional(),
  assets: z
    .array(
      z.object({
        url: z.url({ error: "Invalid Url" }),
      })
    )
    .optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  address: z.string().optional(),
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
