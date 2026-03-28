import { NextResponse } from "next/server";
import {
  createAdminSessionValue,
  verifyAdminCredentials,
  adminCookieName,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "");
    const password = String(body.password ?? "");

    const valid = verifyAdminCredentials(username, password);

    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Kullanıcı adı veya şifre hatalı." },
        { status: 401 }
      );
    }

    const sessionValue = createAdminSessionValue();

    const response = NextResponse.json({
      success: true,
      redirectTo: "/nuray.noglu/dashboard",
    });

    response.cookies.set({
      name: adminCookieName,
      value: sessionValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "Geçersiz istek." },
      { status: 400 }
    );
  }
}