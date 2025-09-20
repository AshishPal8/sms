import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { requireRole } from "../../../middlewares/requireRole";
import { AdminRole } from "../../../generated/prisma";
import {
  getSettingsController,
  updateSettingsController,
} from "./settings.controller";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getSettingsController
);

router.post(
  "/update",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  updateSettingsController
);

export default router;
