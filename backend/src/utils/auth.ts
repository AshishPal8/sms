import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../db";
import { jwtSecret } from "./config";

export const generateToken = (
  payload: JwtPayload | string,
  expiresIn: string = "30d"
) => {
  const options: SignOptions = { expiresIn: expiresIn as any };

  return jwt.sign(payload, jwtSecret, options);
};

export function generateOTP(length = 6) {
  const digit = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digit.length);
    otp += digit[randomIndex];
  }

  return otp;
}

export async function saveOtp(email: string, otp: string) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  try {
    await prisma.oTP.deleteMany({
      where: { email },
    });

    await prisma.oTP.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    return true;
  } catch (error) {
    console.error("Error saving OTP:", error);
    return false;
  }
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  try {
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email,
        otp,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return !!otpRecord;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
}
