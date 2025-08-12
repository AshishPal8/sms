import { roles } from "@/lib/utils";
import {
  LayoutDashboard,
  Ticket,
  Building2,
  Users,
  Settings,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard/superadmin",
    icon: LayoutDashboard,
    roles: [roles.SUPERADMIN],
  },
  {
    label: "Employees",
    href: "/dashboard/superadmin/employees",
    icon: Users,
    roles: [roles.SUPERADMIN],
  },
  {
    label: "Departments",
    href: "/dashboard/superadmin/departments",
    icon: Building2,
    roles: [roles.SUPERADMIN],
  },
  {
    label: "Tickets",
    href: "/dashboard/superadmin/tickets",
    icon: Ticket,
    roles: [roles.SUPERADMIN],
  },
  {
    label: "Settings",
    href: "/dashboard/superadmin/settings",
    icon: Settings,
    roles: [roles.SUPERADMIN],
  },

  {
    label: "Dasboard",
    href: "/dashboard/assistant",
    icon: LayoutDashboard,
    roles: [roles.ASSISTANT],
  },
];
