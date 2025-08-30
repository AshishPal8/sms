import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { requireRole } from "../../../middlewares/requireRole";
import { AdminRole } from "../../../generated/prisma";
import {
  createTicketController,
  createTicketItemController,
  deleteTicketController,
  getTicketByIdController,
  getTicketItemController,
  getTicketsController,
  getTicketStatsController,
  updateTicketController,
  updateTicketItemController,
} from "./ticket.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import {
  createTicketItemSchema,
  createTicketSchema,
  updateTicketItemSchema,
  updateTicketSchema,
} from "./ticket.schema";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(
    AdminRole.SUPERADMIN,
    AdminRole.MANAGER,
    AdminRole.ASSISTANT,
    AdminRole.TECHNICIAN
  ),
  getTicketsController
);

router.get(
  "/stats",
  authMiddleware,
  requireRole(
    AdminRole.SUPERADMIN,
    AdminRole.MANAGER,
    AdminRole.ASSISTANT,
    AdminRole.TECHNICIAN
  ),
  getTicketStatsController
);

router.get(
  "/:id",
  authMiddleware,
  requireRole(
    AdminRole.SUPERADMIN,
    AdminRole.MANAGER,
    AdminRole.ASSISTANT,
    AdminRole.TECHNICIAN
  ),
  getTicketByIdController
);

router.post(
  "/create",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN, AdminRole.ASSISTANT),
  validateRequest(createTicketSchema),
  createTicketController
);

router.put(
  "/update/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN, AdminRole.ASSISTANT),
  validateRequest(updateTicketSchema),
  updateTicketController
);

router.delete(
  "/delete/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN, AdminRole.ASSISTANT),
  deleteTicketController
);

router.post(
  "/item/create",
  authMiddleware,
  validateRequest(createTicketItemSchema),
  createTicketItemController
);

router.put(
  "/item/update/:id",
  authMiddleware,
  requireRole(
    AdminRole.SUPERADMIN,
    AdminRole.MANAGER,
    AdminRole.ASSISTANT,
    AdminRole.TECHNICIAN
  ),
  validateRequest(updateTicketItemSchema),
  updateTicketItemController
);

router.get("/item/:id", authMiddleware, getTicketItemController);

export default router;
