import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const roles = {
  SUPERADMIN: "SUPERADMIN",
  ASSISTANT: "ASSISTANT",
  MANAGER: "MANAGER",
  TECHNICIAN: "TECHNICIAN",
  CUSTOMER: "CUSTOMER",
};

export const DEFAULT_DATE_FORMAT = "MM-dd-yyyy";

export const allowedDateFormat = [
  { key: "dd/MM/yyyy", label: "20/09/2025" },
  { key: "MM/dd/yyyy", label: "09/20/2025" },
  { key: "yyyy-MM-dd", label: "2025-09-20" },
  { key: "dd MMM yyyy", label: "20 Sep 2025" },
  { key: "MMM d, yyyy", label: "Sep 20, 2025" },
  { key: "EEE, dd MMM yyyy", label: "Sat, 20 Sep 2025" },
];
