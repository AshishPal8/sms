import { Router } from "express";
import {
  customerLogoutController,
  customerSigninController,
  customerSignupController,
  getCustomerProfileController,
  resendOtpController,
  updateCustomerController,
  verifyOtpController,
} from "./auth.controller";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { updateCustomerSchema } from "./auth.schema";

const router = Router();

router.get("/me", authMiddleware, getCustomerProfileController);

router.post("/signup", customerSignupController);
router.post("/signin", customerSigninController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.post("/logout", customerLogoutController);

router.post(
  "/update",
  authMiddleware,
  validateRequest(updateCustomerSchema),
  updateCustomerController
);

export default router;
