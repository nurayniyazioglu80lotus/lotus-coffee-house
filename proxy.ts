import { NextRequest, NextResponse } from "next/server";
import { adminCookieName } from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminDashboard = pathname.startsWith("/nuray.noglu/dashboard");
  const isAdminLogin = pathname === "/nuray.noglu";

  const hasSession = !!request.cookies.get(adminCookieName)?.value;

  if (isAdminDashboard && !hasSession) {
    return NextResponse.redirect(new URL("/nuray.noglu", request.url));
  }

  if (isAdminLogin && hasSession) {
    return NextResponse.redirect(new URL("/nuray.noglu/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/nuray.noglu", "/nuray.noglu/dashboard/:path*"],
};