import type { NextFunction, Request, Response } from "express";
import type { AdminRole } from "../generated/prisma";
import { UnauthorizedError } from "./error";

export const requireRole = (role: AdminRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }
    next();
  };
};
