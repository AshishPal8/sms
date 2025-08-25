import type { Response } from "express";

// export const COOKIE_OPTIONS_LOCAL = {
//   httpOnly: true,
//   secure: false,
//   sameSite: "lax" as "lax",
//   path: "/",
//   maxAge: 1000 * 60 * 60 * 24 * 30,
// };

export const COOKIE_OPTIONS_PROD = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 30,
  domain: "sms-opal-five.vercel.app",
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, COOKIE_OPTIONS_PROD);
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", { ...COOKIE_OPTIONS_PROD, maxAge: undefined });
};
