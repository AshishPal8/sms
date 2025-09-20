import z from "zod";

export const udpateSettingsSchema = z.object({
  dateFormat: z.string().min(1),
});

export type updateSettingsInput = z.infer<typeof udpateSettingsSchema>;
