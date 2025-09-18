import { roles } from "./utils";

export const routeAccess = {
  authPublic: ["/signup", "/signin"],

  generalPublic: ["/", "/about", "/contact"],

  protected: {
    [roles.SUPERADMIN]: [
      "/dashboard",
      "/dashboard/employees",
      "/dashboard/divisions",
      "/dashboard/tickets",
      "/dashboard/notification",
      "/dashboard/profile",
      "/dashboard/tree",
    ],
    [roles.MANAGER]: [
      "/dashboard",
      "/dashboard/tickets",
      "/dashboard/notification",
      "/dashboard/profile",
      "/dashboard/tree",
    ],
    [roles.TECHNICIAN]: [
      "/dashboard",
      "/dashboard/tickets",
      "/dashboard/notification",
      "/dashboard/profile",
    ],
    [roles.ASSISTANT]: [
      "/dashboard",
      "/dashboard/tickets",
      "/dashboard/notification",
      "/dashboard/profile",
      "/dashboard/tree",
    ],
    // CUSTOMER has no dashboard routes at all
    [roles.CUSTOMER]: [],
  },
};
