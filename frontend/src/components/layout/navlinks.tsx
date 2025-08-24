import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navlinks";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";

function NavLinks() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const roleDashboards: Record<string, string> = {
    [roles.SUPERADMIN]: "/dashboard/superadmin",
    [roles.ASSISTANT]: "/dashboard/assistant",
    [roles.MANAGER]: "/dashboard/department",
    [roles.TECHNICIAN]: "/dashboard/technician",
  };

  const dashboardHref =
    user && user.role !== roles.CUSTOMER
      ? roleDashboards[user.role] || "/dashboard"
      : null;

  return (
    <nav className="hidden md:flex items-center space-x-10">
      {navLinks.map((nav) => (
        <Link
          key={nav.title}
          href={nav.href}
          className={`hover:text-primary font-medium transition-colors ${
            pathname === nav.href
              ? "text-primary font-extrabold"
              : "text-gray-800"
          }`}
        >
          {nav.title}
        </Link>
      ))}

      {dashboardHref && (
        <Link
          href={dashboardHref}
          className={`hover:text-primary font-medium transition-colors ${
            pathname.startsWith("/dashboard")
              ? "text-primary font-extrabold"
              : "text-gray-800"
          }`}
        >
          Dashboard
        </Link>
      )}
    </nav>
  );
}

export default NavLinks;
