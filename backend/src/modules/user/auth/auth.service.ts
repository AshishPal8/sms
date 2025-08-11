import prisma from "../../../db";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import { generateOTP, saveOtp, verifyOTP } from "../../../utils/auth";
import type {
  customerSigninInput,
  customerSignupInput,
  resendOtpInput,
  verifyOtpInput,
} from "./auth.schema";

export const customerSignupService = async (data: customerSignupInput) => {
  const { name, email } = data;

  const normalizedEmail = email.toLowerCase().trim();

  let customer = await prisma.customer.findUnique({
    where: { email: normalizedEmail },
  });

  if (customer && customer.isVerified) {
    throw new BadRequestError(
      "Account already exists and is verified. Please login instead."
    );
  }

  if (customer && !customer.isVerified) {
    customer = await prisma.customer.update({
      where: { email: normalizedEmail },
      data: {
        name,
        updatedAt: new Date(),
      },
    });
  } else {
    customer = await prisma.customer.create({
      data: { name, email: normalizedEmail, isVerified: false },
    });
  }

  const otp = generateOTP();

  await saveOtp(normalizedEmail, otp);

  //send email

  return {
    success: true,
    message: "OTP sent to your email. Please verify to complete signup.",
    data: {
      id: customer.id,
      email: customer.email,
      otp,
    },
  };
};

export const signinService = async (data: customerSigninInput) => {
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
      message: "Admin login successful.",
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

export const verifyOTPService = async (data: verifyOtpInput) => {
  const { email, otp, action } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const isValidOTP = await verifyOTP(normalizedEmail, otp);
  if (!isValidOTP) {
    throw new BadRequestError("Invalid or expired OTP. Please try again.");
  }

  const customer = await prisma.customer.findUnique({
    where: {
      email: normalizedEmail,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new NotFoundError("Customer account not found.");
  }

  if (action === "signup") {
    const verifiedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: {
        isVerified: true,
        isRegistered: true,
        updatedAt: new Date(),
      },
    });

    await prisma.oTP.deleteMany({
      where: { email: normalizedEmail },
    });

    return {
      success: true,
      message: "Signup completed successfully! Welcome aboard.",
      action: "signup_complete",
      data: {
        id: verifiedCustomer.id,
        name: verifiedCustomer.name,
        email: verifiedCustomer.email,
        role: "CUSTOMER",
      },
    };
  } else if (action === "signin") {
    if (!customer.isVerified) {
      throw new BadRequestError(
        "Account not verified. Please complete signup first."
      );
    }

    if (!customer.isVerified) {
      throw new BadRequestError(
        "Account not verified. Please complete signup first."
      );
    }

    return {
      success: true,
      message: "Login successful! Welcome back.",
      action: "login_complete",
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: "CUSTOMER",
      },
    };
  }
  throw new BadRequestError("Invalid action specified.");
};

export const resendOTPService = async (data: resendOtpInput) => {
  const { email, action } = data;
  const normalizedEmail = email.toLowerCase().trim();

  const customer = await prisma.customer.findUnique({
    where: {
      email: normalizedEmail,
      isDeleted: false,
    },
  });

  if (!customer) {
    throw new NotFoundError("Customer account not found.");
  }

  if (action === "signin" && !customer.isVerified) {
    throw new BadRequestError(
      "Account not verified. Please complete signup first."
    );
  }

  if (action === "signup" && customer.isVerified) {
    throw new BadRequestError(
      "Account already verified. Please login instead."
    );
  }

  const recentOTP = await prisma.oTP.findFirst({
    where: {
      email: normalizedEmail,
      createdAt: {
        gt: new Date(Date.now() - 60000),
      },
    },
  });

  if (recentOTP) {
    throw new BadRequestError(
      "Please wait 1 minute before requesting another OTP."
    );
  }

  const otp = generateOTP();
  await saveOtp(normalizedEmail, otp);

  //send email

  return {
    success: true,
    message: `OTP resent to your email for ${action}.`,
    data: {
      email: normalizedEmail,
      action,
      otp,
    },
  };
};
