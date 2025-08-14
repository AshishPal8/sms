import { Router } from "express";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { createTicketController } from "./ticket.controller";

const router = Router();

router.post("/create", authMiddleware, createTicketController);

export default router;
