import type { Response } from "express";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  // secure: false,
  // sameSite: "lax" as "lax",
  secure: true,
  sameSite: "none" as "none",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 30,
};

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie("token", token, COOKIE_OPTIONS);
};

export const clearAuthCookie = (res: Response) => {
  res.clearCookie("token", { ...COOKIE_OPTIONS, maxAge: undefined });
};
