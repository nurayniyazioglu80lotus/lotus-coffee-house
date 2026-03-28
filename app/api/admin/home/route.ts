import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "home.json");

function readData() {
  const file = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(file);
}

function writeData(data: any) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { success: false, message: "Ana sayfa verisi okunamadı." },
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
        text: body.text ?? data.hero.text,
        image: body.image ?? data.hero.image,
      };
    }

    if (body.type === "experience") {
      data.experience = {
        ...data.experience,
        title: body.title ?? data.experience.title,
        paragraph1: body.paragraph1 ?? data.experience.paragraph1,
        paragraph2: body.paragraph2 ?? data.experience.paragraph2,
        buttonText: body.buttonText ?? data.experience.buttonText,
        image: body.image ?? data.experience.image,
      };
    }

    if (body.type === "signature") {
      data.signature = {
        ...data.signature,
        title: body.title ?? data.signature.title,
        text: body.text ?? data.signature.text,
        image: body.image ?? data.signature.image,
      };
    }

    if (body.type === "footer") {
      data.footer = {
        ...data.footer,
        brandTitle: body.brandTitle ?? data.footer.brandTitle,
        text: body.text ?? data.footer.text,
        actions: body.actions ?? data.footer.actions,
        copyright: body.copyright ?? data.footer.copyright,
      };
    }

    writeData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Ana sayfa verisi güncellenemedi." },
      { status: 500 }
    );
  }
}