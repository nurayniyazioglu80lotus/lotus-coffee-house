import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "about.json");

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
      { success: false, message: "About verisi okunamadı." },
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
        texts: body.texts ?? data.hero.texts,
        images: body.images ?? data.hero.images,
      };
    }

    if (body.type === "purpose") {
      data.purpose = {
        ...data.purpose,
        title: body.title ?? data.purpose.title,
        paragraphs: body.paragraphs ?? data.purpose.paragraphs,
      };
    }

    if (body.type === "features") {
      data.features = {
        ...data.features,
        title: body.title ?? data.features.title,
        description: body.description ?? data.features.description,
        items: body.items ?? data.features.items,
      };
    }

    writeData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "About verisi güncellenemedi." },
      { status: 500 }
    );
  }
}