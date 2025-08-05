import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { adminSigninSchema, adminSignupSchema } from "./auth.schema";
import { adminSignin, adminSignup } from "./auth.controller";
import { authMiddleware } from "../../../middlewares/authMiddleware";

const router = Router();

router.post("/signup", validateRequest(adminSignupSchema), adminSignup);
router.post("/signin", validateRequest(adminSigninSchema), adminSignin);
router.post("/signout", authMiddleware, adminSignin);

export default router;
