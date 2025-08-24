import type { TicketPriority, TicketStatus } from "../generated/prisma";

export interface TicketFilters {
  fromDate?: string;
  toDate?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}
