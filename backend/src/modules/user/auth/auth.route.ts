import { Router } from "express";
import {
  customerSigninController,
  customerSignupController,
  resendOtpController,
  verifyOtpController,
} from "./auth.controller";

const router = Router();

router.post("/signup", customerSignupController);
router.post("/signin", customerSigninController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);

export default router;
