import type { NextFunction, Request, Response } from "express";
import {
  createticketItemService,
  createTicketService,
  deleteTicketService,
  getTicketByIdService,
  getTicketsService,
  getTicketWithItemsService,
  updateTicketItemService,
  updateTicketService,
} from "./ticket.service";
import type {
  TicketPriority,
  TicketStatus,
  TicketUrgency,
} from "../../../generated/prisma";
import { BadRequestError, UnauthorizedError } from "../../../middlewares/error";

export const createTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ticket = await createTicketService(req.body);

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
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("Ticket id is required");
    }
    const ticket = await updateTicketService(id, req.body);

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
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("Ticket id is required");
    }
    const ticket = await deleteTicketService(id);

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
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const {
      fromDate,
      toDate,
      priority,
      status,
      urgencyLevel,
      search,
      sortBy,
      sortOrder,
      page = "1",
      limit = "10",
    } = req.query;

    const numericPage = parseInt(page as string, 10);
    const numericLimit = parseInt(limit as string, 10);

    const filters = {
      fromDate: fromDate as string,
      toDate: toDate as string,
      priority: priority as TicketPriority,
      status: status as TicketStatus,
      urgencyLevel: urgencyLevel as TicketUrgency,
      search: search as string,
      sortBy: sortBy as string,
      sortOrder: (sortOrder as "asc" | "desc") || "desc",
      page: numericPage,
      limit: numericLimit,
    };

    const tickets = await getTicketsService(user, filters);

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Ticket id is required");
    }

    const ticket = await getTicketByIdService(id);
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
};

export const createTicketItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }
    const ticketItem = await createticketItemService(user, req.body);

    res.status(201).json(ticketItem);
  } catch (error) {
    next(error);
  }
};

export const updateTicketItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const ticketItemId = req.params.id;
    if (!ticketItemId) {
      throw new BadRequestError("Ticket item id not found");
    }

    const ticketItem = await updateTicketItemService(
      user,
      ticketItemId,
      req.body
    );

    res.status(200).json(ticketItem);
  } catch (error) {
    next(error);
  }
};

export const getTicketItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    const ticketId = req.params.id;
    if (!ticketId) {
      throw new BadRequestError("Ticket id not found");
    }

    const ticketItem = await getTicketWithItemsService(user, ticketId);

    res.status(200).json(ticketItem);
  } catch (error) {
    next(error);
  }
};
