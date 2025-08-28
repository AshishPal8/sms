import { Router } from "express";
import { signinController, signOutController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/verify-role", signinController);
router.post("/signout", authMiddleware, signOutController);

export default router;
