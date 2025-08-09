import {
  LayoutDashboard,
  Ticket,
  Building2,
  Users,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard/superadmin", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/superadmin/employees", icon: Users },
  {
    label: "Departments",
    href: "/dashboard/superadmin/departments",
    icon: Building2,
  },
  { label: "Tickets", href: "/dashboard/superadmin/tickets", icon: Ticket },
  { label: "Settings", href: "/dashboard/superadmin/settings", icon: Settings },
];
