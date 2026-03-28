import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(
  process.cwd(),
  "data",
  "featured-products.json"
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

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = readData();

  const newItem = {
    id: crypto.randomUUID(),
    title: body.title || "",
    price: body.price || "",
    image: body.image || "",
    description: body.description || "",
    active: body.active ?? true,
  };

  data.items.push(newItem);
  writeData(data);

  return NextResponse.json({ success: true });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const data = readData();

  if (body.type === "section") {
    data.sectionTitle = body.sectionTitle ?? data.sectionTitle;
    data.buttonText = body.buttonText ?? data.buttonText;
    data.buttonLink = body.buttonLink ?? data.buttonLink;

    writeData(data);
    return NextResponse.json({ success: true });
  }

  const index = data.items.findIndex((item: any) => item.id === body.id);

  if (index === -1) {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  data.items[index] = {
    ...data.items[index],
    ...body,
  };

  writeData(data);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const data = readData();

  data.items = data.items.filter((item: any) => item.id !== body.id);

  writeData(data);

  return NextResponse.json({ success: true });
}