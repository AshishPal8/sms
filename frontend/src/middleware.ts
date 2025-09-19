import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeAccess } from "@/lib/routeAccess";
import { verifyAuthToken } from "@/lib/auth";
import { roles } from "./lib/utils";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;
  let user: { role: string } | null = null;

  if (token) {
    try {
      user = await verifyAuthToken(token);
    } catch {
      user = null;

      const response = NextResponse.redirect(new URL("/signin", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (routeAccess.authPublic.includes(pathname)) {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (routeAccess.generalPublic.includes(pathname)) {
    return NextResponse.next();
  }

  if (!user) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (user.role === roles.CUSTOMER) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/dashboard") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard/divisions")) {
    if (user.role !== roles.SUPERADMIN) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const allowedRoutes = routeAccess.protected[user.role] || [];
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
