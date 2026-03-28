import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "contact.json");

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
      { success: false, message: "İletişim verisi okunamadı." },
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

    if (body.type === "map") {
      data.map = {
        ...data.map,
        link: body.link ?? data.map.link,
        image: body.image ?? data.map.image,
      };
    }

    if (body.type === "info") {
      data.info = {
        ...data.info,
        addressLabel: body.addressLabel ?? data.info.addressLabel,
        address: body.address ?? data.info.address,
        phoneLabel: body.phoneLabel ?? data.info.phoneLabel,
        phone: body.phone ?? data.info.phone,
        phoneHref: body.phoneHref ?? data.info.phoneHref,
        whatsappLabel: body.whatsappLabel ?? data.info.whatsappLabel,
        whatsappText: body.whatsappText ?? data.info.whatsappText,
        whatsappHref: body.whatsappHref ?? data.info.whatsappHref,
        hoursLabel: body.hoursLabel ?? data.info.hoursLabel,
        hours: body.hours ?? data.info.hours,
        instagramLabel: body.instagramLabel ?? data.info.instagramLabel,
        instagramText: body.instagramText ?? data.info.instagramText,
        instagramHref: body.instagramHref ?? data.info.instagramHref,
        instagramQr: body.instagramQr ?? data.info.instagramQr,
      };
    }

    if (body.type === "actions") {
      data.actions = {
        ...data.actions,
        callText: body.callText ?? data.actions.callText,
        callHref: body.callHref ?? data.actions.callHref,
        whatsappText: body.whatsappText ?? data.actions.whatsappText,
        whatsappHref: body.whatsappHref ?? data.actions.whatsappHref,
      };
    }

    if (body.type === "invite") {
      data.invite = {
        ...data.invite,
        title: body.title ?? data.invite.title,
        text: body.text ?? data.invite.text,
      };
    }

    writeData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "İletişim verisi güncellenemedi." },
      { status: 500 }
    );
  }
}