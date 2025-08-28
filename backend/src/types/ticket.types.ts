import type {
  TicketPriority,
  TicketStatus,
  TicketUrgency,
} from "../generated/prisma";

export interface TicketFilters {
  fromDate?: string;
  toDate?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  urgencyLevel?: TicketUrgency;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page: number;
  limit: number;
}
