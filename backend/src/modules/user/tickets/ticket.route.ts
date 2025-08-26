import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import {
  createTicketController,
  getTicketByIdController,
  getTicketsController,
  updateTicketController,
} from "./ticket.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createTicketSchema, updateTicketSchema } from "./ticket.schema";

const router = Router();

router.get("/", authMiddleware, getTicketsController);
router.get("/:id", authMiddleware, getTicketByIdController);

router.post(
  "/create",
  authMiddleware,
  validateRequest(createTicketSchema),
  createTicketController
);

router.put(
  "/update/:id",
  authMiddleware,
  validateRequest(updateTicketSchema),
  updateTicketController
);

router.delete("/delete/:id", authMiddleware, updateTicketController);

export default router;
