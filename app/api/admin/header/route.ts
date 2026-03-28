import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const navigationPath = path.join(process.cwd(), "data", "navigation.json");
const actionsPath = path.join(process.cwd(), "data", "header-actions.json");

function readJson(filePath: string) {
  const file = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(file);
}

function writeJson(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const navigation = readJson(navigationPath);
    const actions = readJson(actionsPath);

    return NextResponse.json({
      success: true,
      navigation,
      actions,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Header verileri okunamadı." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (body.type === "navigation") {
      writeJson(navigationPath, body.items || []);
      return NextResponse.json({ success: true });
    }

    if (body.type === "actions") {
      writeJson(actionsPath, body.items || []);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: "Geçersiz güncelleme tipi." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Header verileri güncellenemedi." },
      { status: 500 }
    );
  }
}