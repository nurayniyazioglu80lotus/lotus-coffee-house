import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import {
  adminCookieName,
  verifyAdminSessionValue,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get(adminCookieName)?.value;
    const isValidSession = verifyAdminSessionValue(session);

    if (!isValidSession) {
      return NextResponse.json(
        { success: false, message: "Yetkisiz işlem." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const menuData = body?.menuData;

    if (!menuData || !Array.isArray(menuData.categories)) {
      return NextResponse.json(
        { success: false, message: "Geçersiz menü verisi." },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "data", "menu.json");

    await fs.writeFile(
      filePath,
      JSON.stringify(menuData, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      message: "Menü başarıyla güncellendi.",
    });
  } catch (error) {
    console.error("MENU_UPDATE_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Menü güncellenemedi." },
      { status: 500 }
    );
  }
}