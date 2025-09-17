"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthStore from "@/store/user";
import axios from "axios";
import { baseUrl } from "../../config";
import { roles } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserDropdownProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

function UserDropdown({ isMenuOpen, setIsMenuOpen }: UserDropdownProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const admin = user && user?.role !== roles.CUSTOMER;

  const handleSignout = async () => {
    await axios.post(
      `${baseUrl}/user/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    logout();
    router.push("/signin");
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
            <Link
              href={`${admin ? "/dashboard/profile" : "/profile"}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem className="cursor-pointer">
                <p>{`${user.firstname} ${user.lastname}`}</p>
                <ChevronRight size={16} />
              </DropdownMenuItem>
            </Link>

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
      {!admin && (
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

export default UserDropdown;
