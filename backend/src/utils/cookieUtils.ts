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
  secure: process.env.NODE_ENV === "production",
  sameSite: "none" as "none",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 30,
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, COOKIE_OPTIONS_PROD);
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", { ...COOKIE_OPTIONS_PROD, maxAge: undefined });
};
