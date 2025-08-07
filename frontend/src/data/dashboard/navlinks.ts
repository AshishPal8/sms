import {
  LayoutDashboard,
  Ticket,
  Building2,
  Users,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/employees", icon: Users },
  { label: "Departments", href: "/dashboard/departments", icon: Building2 },
  { label: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
