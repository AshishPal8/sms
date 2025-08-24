// lib/routeAccess.ts
import { roles } from "./utils";

export const routeAccess = {
  authPublic: ["/signup", "/signin"],

  generalPublic: ["/"],

  protected: {
    [roles.SUPERADMIN]: [
      "/dashboard/superadmin",
      "/dashboard/tickets",
      "/dashboard/notification",
      "/dashboard/profile",
    ],
    [roles.MANAGER]: [
      "/dashboard/department",
      "/dashboard/tickets",
      "/dashboard/notification",
      "/dashboard/profile",
    ],
    [roles.TECHNICIAN]: [
      "/dashboard/technician",
      "/dashboard/tickets",
      "/dashboard/notification",
      "/dashboard/profile",
    ],
    [roles.ASSISTANT]: [
      "/dashboard/assistant",
      "/dashboard/tickets",
      "/dashboard/notification",
      "/dashboard/profile",
    ],
    // CUSTOMER has no dashboard routes at all
    [roles.CUSTOMER]: [],
  },
};
