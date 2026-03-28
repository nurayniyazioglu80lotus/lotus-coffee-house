import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "gallery.json");

function readData() {
  const file = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(file);
}

function writeData(data: unknown) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Galeri verisi okunamadı." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const data = readData();

    if (body.type === "hero") {
      data.hero = {
        ...data.hero,
        kicker: body.kicker ?? data.hero.kicker,
        title: body.title ?? data.hero.title,
        text: body.text ?? data.hero.text,
      };
    }

    if (body.type === "images") {
      data.images = body.images ?? data.images;
    }

    writeData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Galeri verisi güncellenemedi." },
      { status: 500 }
    );
  }
}