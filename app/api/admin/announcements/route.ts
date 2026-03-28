import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(
  process.cwd(),
  "data",
  "announcements.json"
);

function readData() {
  const file = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(file);
}

function writeData(data: any) {
  fs.writeFileSync(
    dataPath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

/* =========================
   GET — listeyi getir
========================= */

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

/* =========================
   POST — yeni duyuru ekle
========================= */

export async function POST(req: Request) {
  const body = await req.json();

  const data = readData();

  const newItem = {
    id: crypto.randomUUID(),

    title: body.title || "",

    date: body.date || new Date(),

    image: body.image || "",

    excerpt: body.excerpt || "",

    content: body.content || "",

    active: true,
  };

  data.items.push(newItem);

  writeData(data);

  return NextResponse.json({
    success: true,
  });
}

/* =========================
   PUT — güncelle
========================= */

export async function PUT(req: Request) {
  const body = await req.json();

  const data = readData();

  const index = data.items.findIndex(
    (item: any) => item.id === body.id
  );

  if (index === -1) {
    return NextResponse.json(
      { success: false },
      { status: 404 }
    );
  }

  data.items[index] = {
    ...data.items[index],
    ...body,
  };

  writeData(data);

  return NextResponse.json({
    success: true,
  });
}

/* =========================
   DELETE — sil
========================= */

export async function DELETE(req: Request) {
  const body = await req.json();

  const data = readData();

  data.items = data.items.filter(
    (item: any) => item.id !== body.id
  );

  writeData(data);

  return NextResponse.json({
    success: true,
  });
}