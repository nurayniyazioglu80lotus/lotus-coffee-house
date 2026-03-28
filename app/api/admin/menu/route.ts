import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  adminCookieName,
  verifyAdminSessionValue,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get(adminCookieName)?.value;
    const isValidSession = verifyAdminSessionValue(session);

    if (!isValidSession) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const filePath = path.join(process.cwd(), "data", "menu.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    const menuData = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      data: menuData,
    });
  } catch (error) {
    console.error("MENU_GET_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Menü verisi okunamadı." },
      { status: 500 }
    );
  }
}