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
import { Bell } from "lucide-react";
import NotificationModal from "@/modals/notificaiton-modal";
import api from "@/lib/api";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isTop, setIsTop] = useState(true);

  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const lastScroll = useRef(0);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const admin = user && user?.role !== roles.CUSTOMER;

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications");
      const notifications = res.data?.data ?? [];
      const unread = notifications.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    if (user?.role === roles.CUSTOMER) fetchUnreadCount();
  }, [user]);

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

            <div className="flex gap-8">
              {user?.role === roles.CUSTOMER && (
                <div
                  onClick={() => setNotifOpen(true)}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-100 flex items-center justify-center text-primary font-black rounded-full text-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              )}
              <UserDropdown
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
            </div>
          </div>

          {notifOpen && (
            <NotificationModal
              onClose={() => setNotifOpen(false)}
              setUnreadCount={setUnreadCount}
            />
          )}
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

                {admin ? (
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-gray-800 hover:bg-primary/20 rounded-lg transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="book-a-service"
                    className={`px-4 py-3 text-gray-800 hover:bg-primary/20 rounded-lg transition-colors 
                    ${
                      pathname === "book-a-service"
                        ? "bg-primary text-white font-extrabold"
                        : "text-gray-800"
                    }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book a Service
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
