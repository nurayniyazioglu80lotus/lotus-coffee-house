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

function sanitizeFileName(fileName: string) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);

  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöçĞÜŞİÖÇ\-_\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const timestamp = Date.now();

  return `${safeBase || "gorsel"}-${timestamp}${ext.toLowerCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const session =
      request.cookies.get(adminCookieName)?.value;

    const isValidSession =
      verifyAdminSessionValue(session);

    if (!isValidSession) {
      return NextResponse.json(
        {
          success: false,
          message: "Yetkisiz işlem.",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const folderValue = String(
      formData.get("folder") || ""
    );

    const file = formData.get("file");

    if (!isAllowedFolder(folderValue)) {
      return NextResponse.json(
        {
          success: false,
          message: "Geçersiz klasör.",
        },
        { status: 400 }
      );
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Dosya bulunamadı.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Sadece jpg, png, webp veya gif yükleyebilirsin.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = sanitizeFileName(file.name);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      folderValue
    );

    const filePath = path.join(
      uploadDir,
      fileName
    );

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      filePath: `/uploads/${folderValue}/${fileName}`,
    });

  } catch (error) {

    console.error("UPLOAD_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Dosya yükleme sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}