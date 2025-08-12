"use client";
import { navItems } from "@/data/dashboard/navlinks";
import useAuthStore from "@/store/user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SidebarLinks = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const userRole = user?.role || "";

  const visibleNavLinks = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="mt-5 md:mt-10">
      <ul className="space-y-2">
        {visibleNavLinks.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex gap-4 items-center justify-start p-3 rounded-lg hover:bg-[#4880FF] duration-300 text-gray-600 hover:text-white cursor-pointer ${
                pathname.endsWith(item.href) ? "bg-[#4880FF] text-white" : ""
              }`}
            >
              <item.icon size={20} />
              <p className="text-[14px] font-semibold">{item.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarLinks;
