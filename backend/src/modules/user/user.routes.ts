import { Router } from "express";
import userAuthRoutes from "./auth/auth.route";

const router = Router();

router.use("/auth", userAuthRoutes);

export default router;
