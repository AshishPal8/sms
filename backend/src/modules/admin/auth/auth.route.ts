import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { adminSigninSchema, adminSignupSchema } from "./auth.schema";
import { adminLogout, adminSignin, adminSignup } from "./auth.controller";

const router = Router();

router.post("/signup", validateRequest(adminSignupSchema), adminSignup);
router.post("/signin", validateRequest(adminSigninSchema), adminSignin);

export default router;
