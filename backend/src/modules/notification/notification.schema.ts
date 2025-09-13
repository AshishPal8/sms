import { z } from "zod";
import {
  NotificationType,
  ActionType,
  AssignmentRole,
} from "../../generated/prisma";
import { roles } from "../../utils/roles";

export const createNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  notificationType: z.enum(NotificationType),
  actionType: z.enum(ActionType),
  data: z.record(z.string(), z.any()).optional(),
  isPublic: z.boolean().optional(),

  sender: z.object({
    role: z.enum(roles),
    adminId: z.string().optional(),
    customerId: z.string().optional(),
  }),

  receivers: z
    .array(
      z.object({
        role: z.enum(AssignmentRole),
        adminId: z.string().optional(),
        customerId: z.string().optional(),
      })
    )
    .optional()
    .default([]),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
