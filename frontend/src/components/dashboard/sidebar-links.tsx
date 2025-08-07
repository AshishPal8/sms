"use client";
import { navItems } from "@/data/dashboard/navlinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SidebarLinks = () => {
  const pathname = usePathname();

  return (
    <div className="mt-5 md:mt-10">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex gap-2 items-center px-3 py-2 rounded hover:bg-blue-800 text-black hover:text-white cursor-pointer ${
                pathname.endsWith(item.href) ? "bg-blue-800 text-white" : ""
              }`}
            >
              <item.icon />
              <p>{item.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarLinks;
