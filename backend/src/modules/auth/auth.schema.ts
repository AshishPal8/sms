import z from "zod";

export const signinSchema = z.object({
  email: z.email({ error: "Invalid email" }),
});

export type signinInput = z.infer<typeof signinSchema>;
