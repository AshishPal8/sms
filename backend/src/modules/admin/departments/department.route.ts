import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { requireRole } from "../../../middlewares/requireRole";
import { AdminRole } from "../../../generated/prisma";
import {
  addDepartmentController,
  deleteDepartmentController,
  getAllDepartmentController,
  getDepartmentByIdController,
  updateDepartmentController,
} from "./department.controller";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "./department.schema";

const router = Router();

router.get(
  "/",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getAllDepartmentController
);

router.get(
  "/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getDepartmentByIdController
);

router.post(
  "/add",
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
