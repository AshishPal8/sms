import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { requireRole } from "../../../middlewares/requireRole";
import { AdminRole } from "../../../generated/prisma";
import {
  addDepartmentController,
  deleteDepartmentController,
  getActiveDepartmentsController,
  getAllDepartmentController,
  getDepartmentByIdController,
  getDepartmentEmployeesIdController,
  getDepartmentsStatsController,
  updateDepartmentController,
} from "./department.controller";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "./department.schema";

const router = Router();

router.get(
  "/:divisionId",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getAllDepartmentController
);

router.get(
  "/stats",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getDepartmentsStatsController
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
  getActiveDepartmentsController
);

router.get(
  "/by-id/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getDepartmentByIdController
);

router.get(
  "/employees/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getDepartmentEmployeesIdController
);

router.post(
  "/add/:divisionId",
  validateRequest(createDepartmentSchema),
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  addDepartmentController
);

router.put(
  "/update/:id",
  validateRequest(updateDepartmentSchema),
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  updateDepartmentController
);

router.delete(
  "/delete/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  deleteDepartmentController
);

export default router;
