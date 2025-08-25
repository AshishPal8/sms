import { Router } from "express";
import { signinController } from "./auth.controller";

const router = Router();

router.post("/verify-role", signinController);

export default router;
