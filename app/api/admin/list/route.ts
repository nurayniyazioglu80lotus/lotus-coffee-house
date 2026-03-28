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

    const folderValue = request.nextUrl.searchParams.get("folder") || "";

    if (!isAllowedFolder(folderValue)) {
      return NextResponse.json(
        { success: false, message: "Geçersiz klasör." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      folderValue
    );

    await fs.mkdir(uploadDir, { recursive: true });

    const fileNames = await fs.readdir(uploadDir);

    const files = fileNames.map((fileName) => ({
      name: fileName,
      url: `/uploads/${folderValue}/${fileName}`,
    }));

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error("LIST_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Dosyalar listelenemedi." },
      { status: 500 }
    );
  }
}