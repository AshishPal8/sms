import type { NextFunction, Request, Response } from "express";
import {
  createTicketService,
  deleteTicketService,
  getCustomerTicketByIdService,
  getCustomerTicketsService,
  updateTicketService,
} from "./ticket.service";
import { BadRequestError, UnauthorizedError } from "../../../middlewares/error";

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

export const updateTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ticketId = req.params?.id;

    if (!ticketId) throw new BadRequestError("Ticket not found");

    const ticket = await updateTicketService(req.body, ticketId);

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};
export const deleteTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ticketId = req.params?.id;

    if (!ticketId) throw new BadRequestError("Ticket not found");

    const ticket = await deleteTicketService(ticketId);

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const getTicketsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user?.id;

    if (!customerId) throw new UnauthorizedError("Unauthorized");

    const ticket = await getCustomerTicketsService(customerId);

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const getTicketByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user?.id;
    if (!customerId) throw new UnauthorizedError("Unauthorized");

    const ticketId = req.params?.id;
    if (!ticketId) throw new BadRequestError("Ticket not found");

    const ticket = await getCustomerTicketByIdService(ticketId, customerId);

    res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};
