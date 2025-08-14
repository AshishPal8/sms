// lib/routeAccess.ts
import { roles } from "./utils";

export const routeAccess = {
  authPublic: ["/signup", "/signin"],

  generalPublic: ["/"],

  protected: {
    [roles.SUPERADMIN]: ["/dashboard/superadmin", "/dashboard/notification"],
    [roles.MANAGER]: ["/dashboard/department", "/dashboard/notification"],
    [roles.TECHNICIAN]: ["/dashboard/technician", "/dashboard/notification"],
    [roles.ASSISTANT]: ["/dashboard/assistant", "/dashboard/notification"],
    // CUSTOMER has no dashboard routes at all
    [roles.CUSTOMER]: [],
  },
};
