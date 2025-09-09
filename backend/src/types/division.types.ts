export type GetAllDivisonOptions = {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  isActive?: boolean;
};
