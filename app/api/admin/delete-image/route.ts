import { NextRequest, NextResponse } from "next/server";
import {
  adminCookieName,
  verifyAdminSessionValue,
} from "@/lib/admin-auth";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

const ALLOWED_FOLDERS = [
  "menu",
  "gallery",
  "slider",
  "duyurular",
] as const;

type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

function isAllowedFolder(value: string): value is AllowedFolder {
  return ALLOWED_FOLDERS.includes(value as AllowedFolder);
}

function isSafeFileName(fileName: string) {
  return (
    !!fileName &&
    !fileName.includes("..") &&
    !fileName.includes("/") &&
    !fileName.includes("\\")
  );
}

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
    const folder = String(body?.folder || "");
    const fileName = String(body?.fileName || "");

    if (!isAllowedFolder(folder)) {
      return NextResponse.json(
        { success: false, message: "Geçersiz klasör." },
        { status: 400 }
      );
    }

    if (!isSafeFileName(fileName)) {
      return NextResponse.json(
        { success: false, message: "Geçersiz dosya adı." },
        { status: 400 }
      );
    }

    const filePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      folder,
      fileName
    );

    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: "Görsel silindi.",
    });
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return NextResponse.json(
        { success: false, message: "Dosya bulunamadı." },
        { status: 404 }
      );
    }

    console.error("DELETE_IMAGE_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Görsel silinemedi." },
      { status: 500 }
    );
  }
}