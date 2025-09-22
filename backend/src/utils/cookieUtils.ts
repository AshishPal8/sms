import type { Response } from "express";
import { DEFAULT_COOKIE_MAX_AGE } from "./config";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as "lax",
  path: "/",
};

// export const COOKIE_OPTIONS = {
//   httpOnly: true,
//   secure: true,
//   sameSite: "none" as const,
//   domain: ".ashishpro.com",
//   path: "/",
// };

export const setAuthCookie = (
  res: Response,
  token: string,
  maxAgeMs: number = DEFAULT_COOKIE_MAX_AGE
) => {
  const opts = {
    ...COOKIE_OPTIONS,
    maxAge: maxAgeMs,
  };

  res.cookie("token", token, opts);
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", { ...COOKIE_OPTIONS });
};
