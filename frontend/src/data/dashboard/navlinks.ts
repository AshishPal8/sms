import { roles } from "@/lib/utils";
import {
  LayoutDashboard,
  Ticket,
  Building2,
  Users,
  Settings,
  Bell,
  FolderTree,
} from "lucide-react";

export const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [roles.SUPERADMIN, roles.ASSISTANT, roles.MANAGER, roles.TECHNICIAN],
  },
  {
    label: "Tree",
    href: "/dashboard/tree",
    icon: FolderTree,
    roles: [roles.SUPERADMIN, roles.ASSISTANT, roles.MANAGER],
  },
  {
    label: "Employees",
    href: "/dashboard/employees",
    icon: Users,
    roles: [roles.SUPERADMIN, roles.MANAGER],
  },
  {
    label: "Divisions",
    href: "/dashboard/divisions",
    icon: Building2,
    roles: [roles.SUPERADMIN],
  },
  {
    label: "Tickets",
    href: "/dashboard/tickets",
    icon: Ticket,
    roles: [roles.SUPERADMIN, roles.ASSISTANT, roles.MANAGER, roles.TECHNICIAN],
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    roles: [roles.SUPERADMIN, roles.ASSISTANT, roles.MANAGER, roles.TECHNICIAN],
  },
  {
    label: "Settings",
    href: "/dashboard/superadmin/settings",
    icon: Settings,
    roles: [roles.SUPERADMIN],
  },
];
