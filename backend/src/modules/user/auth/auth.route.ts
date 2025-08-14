import { Router } from "express";
import {
  customerLogoutController,
  customerSigninController,
  customerSignupController,
  getCustomerProfileController,
  resendOtpController,
  verifyOtpController,
} from "./auth.controller";
import { authMiddleware } from "../../../middlewares/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, getCustomerProfileController);

router.post("/signup", customerSignupController);
router.post("/signin", customerSigninController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.post("/logout", customerLogoutController);

export default router;
