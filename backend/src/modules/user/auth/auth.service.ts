import prisma from "../../../db";
import { BadRequestError, NotFoundError } from "../../../middlewares/error";
import { generateOTP, saveOtp, verifyOTP } from "../../../utils/auth";
import { emailService } from "../../email/email.service";
import type {
  customerSigninInput,
  customerSignupInput,
  resendOtpInput,
  updateCustomerInput,
  verifyOtpInput,
} from "./auth.schema";

export const customerSignupService = async (data: customerSignupInput) => {
  const { firstname, lastname, email } = data;

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
        firstname,
        lastname,
        updatedAt: new Date(),
      },
    });
  } else {
    customer = await prisma.customer.create({
      data: { firstname, lastname, email: normalizedEmail, isVerified: false },
    });
  }

  const otp = generateOTP();

  await saveOtp(normalizedEmail, otp);

  //send email
  // await emailService.sendCustomerSignupOtpMail(normalizedEmail, { name, otp });

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
      message: "Enter Password to login",
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
  // await emailService.sendCustomerSigninOtpMail(normalizedEmail, {
  //   name: customer.name,
  //   otp,
  // });

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

    // await emailService.sendWelcomeCustomerMail(normalizedEmail, {
    //   name: verifiedCustomer.name,
    // });

    return {
      success: true,
      message: "Signup completed successfully! Welcome aboard.",
      action: "signup_complete",
      data: {
        id: verifiedCustomer.id,
        firstname: verifiedCustomer.firstname,
        lastname: verifiedCustomer.lastname,
        profilePicture: verifiedCustomer.profilePicture,
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
        firstname: customer.firstname,
        lastname: customer.lastname,
        profilePicture: customer.profilePicture,
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

  // resend email
  // await emailService.sendResendOtpMail(normalizedEmail, {
  //   name: customer.name,
  //   otp,
  //   action,
  // });

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

export const getCustomerService = async (id: string) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      address: true,
      profilePicture: true,
      insuranceCompany: true,
      policyNumber: true,
      policyExpiryDate: true,
      insuranceContactNo: true,
      insuranceDeductable: true,
      isRoofCovered: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!customer) throw new NotFoundError("Customer not found");

  return customer;
};

export const updateCustomerService = async (
  customerId: string,
  data: updateCustomerInput
) => {
  const {
    firstname,
    lastname,
    phone,
    profilePicture,
    address,
    insuranceCompany,
    insuranceDeductable,
    policyNumber,
    policyExpiryDate,
    insuranceContactNo,
    isRoofCovered,
  } = data;

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      id: true,
      addressId: true,
    },
  });

  if (!customer) throw new NotFoundError("Customer not found");

  const updateData: any = {};

  if (firstname !== undefined) updateData.firstname = firstname;
  if (lastname !== undefined) updateData.lastname = lastname;
  if (phone !== undefined) updateData.phone = phone;
  if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
  if (insuranceCompany !== undefined)
    updateData.insuranceCompany = insuranceCompany;
  if (insuranceDeductable !== undefined)
    updateData.insuranceDeductable = insuranceDeductable;
  if (policyNumber !== undefined) updateData.policyNumber = policyNumber;
  if (policyExpiryDate !== undefined)
    updateData.policyExpiryDate = policyExpiryDate; // assume Date
  if (insuranceContactNo !== undefined)
    updateData.insuranceContactNo = insuranceContactNo;
  if (isRoofCovered !== undefined) updateData.isRoofCovered = isRoofCovered;

  if (address !== undefined && address !== null) {
    const addrPayload: any = {
      houseNumber: address.houseNumber ?? undefined,
      locality: address.locality ?? undefined,
      city: address.city ?? undefined,
      state: address.state ?? undefined,
      country: address.country ?? undefined,
      postalCode: address.postalCode ?? undefined,
    };

    if (customer.addressId) {
      updateData.address = { update: addrPayload };
    } else {
      updateData.address = { create: addrPayload };
    }
  }

  if (Object.keys(updateData).length === 0) {
    const current = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { address: true },
    });
    return {
      success: true,
      message: "No fields changed",
      data: current,
    };
  }

  const updatedCustomer = await prisma.customer.update({
    where: { id: customerId },
    data: updateData,
    include: { address: true },
  });

  return {
    success: true,
    message: "Customer updated successfully",
    data: updatedCustomer,
  };
};
