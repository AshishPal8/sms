import type { NextFunction, Request, Response } from "express";
import type { AdminRole } from "../generated/prisma";
import { UnauthorizedError } from "./error";

export const requireRole = (...allowedRoles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    console.log("user role", userRole);

    if (!userRole || !allowedRoles.includes(userRole as AdminRole)) {
      throw new UnauthorizedError(
        "You are not authorized to perform this action"
      );
    }
    next();
  };
};
