import prisma from "../../db";
import { BadRequestError, NotFoundError } from "../../middlewares/error";
import { generateOTP, saveOtp } from "../../utils/auth";
import type { signinInput } from "./auth.schema";

export const signinService = async (data: signinInput) => {
  const { email } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const admin = await prisma.admin.findUnique({
    where: {
      email: normalizedEmail,
      isDeleted: false,
    },
  });

  if (admin) {
    return {
      success: true,
      message: "Enter password to continue.",
      data: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  const customer = await prisma.customer.findUnique({
    where: {
      email: normalizedEmail,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new NotFoundError(
      "No account found with this email. Please signup first."
    );
  }

  if (!customer.isVerified) {
    throw new BadRequestError(
      "Account not verified. Please complete signup verification first."
    );
  }

  const otp = generateOTP();
  await saveOtp(normalizedEmail, otp);

  //send email

  return {
    success: true,
    message: "OTP sent to your email for login verification.",
    data: {
      id: customer.id,
      email: customer.email,
      otp,
      role: "CUSTOMER",
    },
  };
};
