export type GetAllDivisonOptions = {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  isActive?: boolean;
  isDeleted?: boolean;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  email?: string | null;
  profilePicture?: string | null;
};

export type DeptNode = {
  id: string;
  name: string;
  managers: Employee[];
  technicians: Employee[];
};

export type DivisionNode = {
  id: string;
  name: string;
  departments: DeptNode[];
};
