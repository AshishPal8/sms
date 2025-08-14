import { Router } from "express";
import userAuthRoutes from "./auth/auth.route";
import ticketRoutes from "./tickets/ticket.route";

const router = Router();

router.use("/auth", userAuthRoutes);
router.use("/ticket", ticketRoutes);

export default router;
