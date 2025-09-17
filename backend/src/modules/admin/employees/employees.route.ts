import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { addEmployeeSchema, updateEmployeeSchema } from "./employees.schema";
import {
  addEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeProfile,
  getEmployeeStatsController,
  getEmployeesWithDepartmentIdController,
  updateEmployee,
} from "./employees.controller";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { requireRole } from "../../../middlewares/requireRole";
import { AdminRole } from "../../../generated/prisma";

const router = Router();

router.get("/me", authMiddleware, getEmployeeProfile);

router.get(
  "/",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN, AdminRole.MANAGER),
  getAllEmployees
);

router.get(
  "/stats",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getEmployeeStatsController
);

router.get(
  "/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  getEmployeeById
);

router.get("/dept/:id", authMiddleware, getEmployeesWithDepartmentIdController);

router.post(
  "/add",
  validateRequest(addEmployeeSchema),
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  addEmployee
);

router.put(
  "/update/:id",
  validateRequest(updateEmployeeSchema),
  authMiddleware,
  requireRole(
    AdminRole.SUPERADMIN,
    AdminRole.MANAGER,
    AdminRole.ASSISTANT,
    AdminRole.TECHNICIAN
  ),
  updateEmployee
);

router.delete(
  "/delete/:id",
  authMiddleware,
  requireRole(AdminRole.SUPERADMIN),
  deleteEmployee
);

export default router;
