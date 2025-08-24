import type { NextFunction, Request, Response } from "express";
import { createTicketService } from "./ticket.service";
import { UnauthorizedError } from "../../../middlewares/error";

export const createTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user?.id;

    if (!customerId) throw new UnauthorizedError("Unauthorized");

    const ticket = await createTicketService(req.body, customerId);

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};
