import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { requireRole } from "../../../middlewares/requireRole";
import { AdminRole } from "../../../generated/prisma";
import {
  createDivisionController,
  deleteDivisionController,
  getActiveDivisionsController,
  getAllDivisionController,
  getDepartmentsByDivisionController,
  getDivisionByIdController,
  getDivisionStatsController,
  updateDivisionController,
} from "./division.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.schema";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getAllDivisionController
);

router.get(
  "/stats",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getDivisionStatsController
);

router.get(
  "/active",
  authMiddleware,
  requireRole(
    AdminRole.SUPERADMIN,
    AdminRole.ASSISTANT,
    AdminRole.MANAGER,
    AdminRole.TECHNICIAN
  ),
  getActiveDivisionsController
);

router.get(
  "/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getDivisionByIdController
);

router.get(
  "/dept/:divisionId",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN, AdminRole.ASSISTANT),
  getDepartmentsByDivisionController
);

router.post(
  "/add",
  validateRequest(createDivisionSchema),
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  createDivisionController
);

router.put(
  "/update/:id",
  validateRequest(updateDivisionSchema),
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  updateDivisionController
);

router.delete(
  "/delete/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  deleteDivisionController
);

export default router;
