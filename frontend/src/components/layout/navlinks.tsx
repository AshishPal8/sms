import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/navlinks";
import useAuthStore from "@/store/user";
import { roles } from "@/lib/utils";

function NavLinks() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const isLoggedIn = !!user;
  const isCustomer = user?.role === roles.CUSTOMER;
  const isAdmin = isLoggedIn && !isCustomer;

  return (
    <nav className="hidden md:flex items-center space-x-10">
      {navLinks.map((nav) => (
        <Link
          key={nav.title}
          href={nav.href}
          className={`hover:text-primary font-medium transition-colors ${
            pathname === nav.href
              ? "text-primary font-extrabold"
              : "text-gray-800"
          }`}
        >
          {nav.title}
        </Link>
      ))}
      {(!isLoggedIn || isCustomer) && (
        <Link
          href="/book-a-service"
          className={`hover:text-primary font-medium transition-colors ${
            pathname === "/book-a-service"
              ? "text-primary font-extrabold"
              : "text-gray-800"
          }`}
        >
          Book a Service
        </Link>
      )}
      {isAdmin && (
        <Link
          href="/dashboard"
          className={`hover:text-primary font-medium transition-colors ${
            pathname === "/dashboard"
              ? "text-primary font-extrabold"
              : "text-gray-800"
          }`}
        >
          Dashboard
        </Link>
      )}
    </nav>
  );
}

export default NavLinks;
