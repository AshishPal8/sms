"use client";
import React, { useState } from "react";
import useAuthStore from "@/store/user";
import { navItems } from "@/data/dashboard/navlinks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, Menu } from "lucide-react";
import axios from "axios";
import { baseUrl } from "../../config";
import { usePathname, useRouter } from "next/navigation";
import DashMobileSidebar from "./dash-mobile-sidebar";

const DashHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  const handleSignout = async () => {
    await axios.post(
      `${baseUrl}/user/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    router.push("/admin/signin");
    logout();
  };

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
                className="font-extrabold text-xl md:text-2xl text-primary"
              >
                {nav.label}
              </h1>
            ) : null
          )}
        </div>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="rounded-xl flex items-center justify-center gap-2 cursor-pointer">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.profilePicture || "/default.webp"}
                    alt=""
                  />
                  <AvatarFallback className="text-xs">
                    {user.name[0] || "B"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <h2 className="text-black font-bold text-[14px]">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 capitalize text-xs font-semibold">
                    {user.role
                      ? user.role.charAt(0).toUpperCase() +
                        user.role.slice(1).toLowerCase()
                      : ""}
                  </p>
                </div>
                <div>
                  <ChevronDown size={22} />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{user.name}</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleSignout}
                className="cursor-pointer"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
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
