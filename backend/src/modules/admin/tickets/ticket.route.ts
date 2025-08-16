import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { requireRole } from "../../../middlewares/requireRole";
import { AdminRole } from "../../../generated/prisma";
import {
  createTicketController,
  deleteTicketController,
  getTicketByIdController,
  getTicketsController,
  updateTicketController,
} from "./ticket.controller";

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
  requireRole(AdminRole.ASSISTANT),
  createTicketController
);

router.put(
  "/update/:id",
  authMiddleware,
  requireRole(AdminRole.ASSISTANT),
  updateTicketController
);

router.delete(
  "/delete/:id",
  authMiddleware,
  requireRole(AdminRole.ASSISTANT),
  deleteTicketController
);

export default router;
