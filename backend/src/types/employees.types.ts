export type GetAllEmployeesOptions = {
  adminId: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  role?: string;
  managerId?: string;
  isActive?: boolean;
};
