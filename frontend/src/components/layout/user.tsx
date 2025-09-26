"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";
import { signOut } from "../../lib/signOut";

interface UserDropdownProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

function UserDropdown({ isMenuOpen, setIsMenuOpen }: UserDropdownProps) {
  const { user } = useAuthStore();

  const admin = user && user?.role !== roles.CUSTOMER;

  const handleSignout = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center space-x-6">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              {/* Avatar */}
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.profilePicture || "/default.webp"}
                    alt={user.firstname}
                  />
                  <AvatarFallback className="text-xs">
                    {`${user.firstname?.[0] ?? ""}${
                      user.lastname ? user.lastname[0] : ""
                    }` || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>

              {/* Name + role only for admins */}
              {admin && (
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-800">
                    {`${user.firstname} ${user.lastname ?? ""}`}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user.role ? user.role.toLowerCase() : ""}
                  </span>
                </div>
              )}

              {/* Down Arrow */}
              <ChevronDown
                size={18}
                className="text-gray-500 group-hover:text-gray-700 transition"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={`${admin ? "/dashboard/profile" : "/profile"}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem className="cursor-pointer">
                <p>{`${user.firstname} ${user.lastname}`}</p>
                <ChevronRight size={16} />
              </DropdownMenuItem>
            </Link>
            {admin && (
              <Link href="/dashboard" className="cursor-pointer">
                <DropdownMenuItem className="cursor-pointer">
                  <p>Dashboard</p>
                  <ChevronRight size={16} />
                </DropdownMenuItem>
              </Link>
            )}

            <DropdownMenuItem
              onClick={handleSignout}
              className="cursor-pointer bg-red-100 hover:bg-red-200 text-red-600"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild>
          <Link href="/signin">Sign In</Link>
        </Button>
      )}
      <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <Menu className="h-6 w-6" />
      </button>
    </div>
  );
}

export default UserDropdown;
