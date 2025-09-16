"use client";
import { navItems } from "@/data/dashboard/navlinks";
import useAuthStore from "@/store/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const normalize = (p: string) =>
  p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;

const SidebarLinks = () => {
  const pathnameRaw = usePathname() || "/";
  const pathname = normalize(pathnameRaw);

  const { user } = useAuthStore();
  const userRole = user?.role || "";

  const visibleNavLinks = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const isActive = (hrefRaw: string) => {
    const href = normalize(hrefRaw);

    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="mt-5 md:mt-10">
      <ul className="space-y-2">
        {visibleNavLinks.map((item) => {
          const active = isActive(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex gap-4 items-center justify-start p-3 rounded-lg hover:bg-primary duration-300 text-gray-600 hover:text-primary-foreground cursor-pointer ${
                  active ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <item.icon size={20} />
                <p className="text-[14px] font-semibold">{item.label}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SidebarLinks;
