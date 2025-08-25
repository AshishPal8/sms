import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  getNotificationsController,
  markNotificationAsReadController,
} from "./notification.controller";

const router = Router();

router.get("/", authMiddleware, getNotificationsController);
router.patch("/:id", authMiddleware, markNotificationAsReadController);

export default router;
