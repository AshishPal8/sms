"use client";
import React, { useState } from "react";
import { navItems } from "@/data/dashboard/navlinks";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import DashMobileSidebar from "./dash-mobile-sidebar";
import UserDropdown from "../layout/user";
import useAuthStore from "@/store/user";

const normalize = (p: string) =>
  p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p;

const isPrefix = (pathname: string, prefix: string) => {
  const p = normalize(pathname);
  const pre = normalize(prefix);
  if (pre === "/") return p === "/";
  return p === pre || p.startsWith(pre + "/");
};

const DashHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathnameRaw = usePathname() || "/";
  const pathname = normalize(pathnameRaw);

  const { user } = useAuthStore();
  const userRole = user?.role || "";

  const visibleNavLinks = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const activeNav = visibleNavLinks
    .filter((item) => isPrefix(pathname, item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <div className="fixed top-0 right-0 w-full md:w-4/5 bg-white px-3 md:px-10 py-2 border-b z-30">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center justify-center">
          <Menu
            size={24}
            onClick={() => setSidebarOpen(true)}
            className="block md:hidden"
          />
          {activeNav ? (
            <h1 className="font-extrabold text-xl md:text-2xl text-black">
              {activeNav.label}
            </h1>
          ) : (
            <h1 className="font-extrabold text-xl md:text-2xl text-black">
              Dashboard
            </h1>
          )}
        </div>
        <UserDropdown isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>

      {sidebarOpen && (
        <div className="absolute left-0 top-0 z-50 w-4/5 sm:w-2/3 h-full bg-white shadow-md md:hidden">
          <DashMobileSidebar
            setSidebarOpen={setSidebarOpen}
            open={sidebarOpen}
          />
        </div>
      )}
    </div>
  );
};

export default DashHeader;
