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
