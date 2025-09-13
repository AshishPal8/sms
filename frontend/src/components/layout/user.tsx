"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthStore from "@/store/user";
import axios from "axios";
import { baseUrl } from "../../config";

interface UserDropdownProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

function UserDropdown({ isMenuOpen, setIsMenuOpen }: UserDropdownProps) {
  const { user, logout } = useAuthStore();

  const handleSignout = async () => {
    await axios.post(
      `${baseUrl}/user/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    logout();
  };

  return (
    <div className="flex items-center space-x-6">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user.profilePicture || "/default.webp"}
                  alt=""
                />
                <AvatarFallback className="text-xs">
                  {`${user.firstname[0]}${
                    user.lastname ? " " + user.lastname[0] : ""
                  }` || "B"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href="/profile" className="cursor-pointer">
              <DropdownMenuItem>{`${user.firstname} ${user.lastname}`}</DropdownMenuItem>
            </Link>
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
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
