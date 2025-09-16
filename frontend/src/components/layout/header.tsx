"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navlinks";
import Logo from "./logo";
import NavLinks from "./navlinks";
import UserDropdown from "./user";
import { cn, roles } from "@/lib/utils";
import useAuthStore from "@/store/user";
import { Button } from "../ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isTop, setIsTop] = useState(true);
  const lastScroll = useRef(0);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const admin = user && user?.role !== roles.CUSTOMER;

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll <= 10) {
        setIsTop(true);
        setShowHeader(true);
      } else {
        setIsTop(false);

        if (currentScroll > lastScroll.current) {
          setShowHeader(false);
        } else if (currentScroll < lastScroll.current) {
          setShowHeader(true);
        }
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b shadow",
          isTop ? "bg-transparent backdrop-blur-sm" : "bg-white shadow-md",
          showHeader ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-1">
            <Logo />

            <NavLinks />

            <div className="flex gap-4">
              <Link href="/book-a-service">
                <Button className="relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-blue-400 to-blue-400 active:scale-95">
                  <span className="w-full h-full flex items-center gap-2 px-3 py-4 bg-blue-700 text-white rounded-[14px] bg-gradient-to-t from-blue-600 to-blue-500">
                    Book Service
                  </span>
                </Button>
              </Link>
              <UserDropdown
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t relative">
            <div
              className="z-10 top-0 left-0 h-screen w-full absolute"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="container bg-white mx-auto px-4 py-4 z-50 absolute">
              <nav className="flex flex-col space-y-3">
                {navLinks.map((nav) => (
                  <Link
                    key={nav.href}
                    href={nav.href}
                    className={`px-4 py-3 text-gray-800 hover:bg-primary/20 rounded-lg transition-colors 
                    ${
                      pathname === nav.href
                        ? "bg-primary text-white font-extrabold"
                        : "text-gray-800"
                    }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {nav.title}
                  </Link>
                ))}
                {admin && (
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-gray-800 hover:bg-primary/20 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
