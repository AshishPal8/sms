"use client";
import React, { useState } from "react";
import { navItems } from "@/data/dashboard/navlinks";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import DashMobileSidebar from "./dash-mobile-sidebar";
import UserDropdown from "../layout/user";

const DashHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  return (
    <div className="fixed top-0 right-0 w-full md:w-4/5 bg-white px-3 md:px-10 py-2 border-b z-30">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center justify-center">
          <Menu
            size={24}
            onClick={() => setSidebarOpen(true)}
            className="block md:hidden"
          />
          {navItems.map((nav) =>
            pathname.endsWith(nav.href) ? (
              <h1
                key={nav.href}
                className="font-extrabold text-xl md:text-2xl text-black"
              >
                {nav.label}
              </h1>
            ) : null
          )}
        </div>
        <UserDropdown isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>

      {sidebarOpen && (
        <div className="absolute left-0 top-0 z-50 w-4/5 sm:w-2/3 h-full bg-white shadow-md md:hidden">
          <DashMobileSidebar setSidebarOpen={setSidebarOpen} />
        </div>
      )}
    </div>
  );
};

export default DashHeader;
