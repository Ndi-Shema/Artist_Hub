import { NextResponse } from "next/server";
import { client } from "@/app/lib/sanity";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    // 1) Parse the formData to get the file
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2) Convert the File to a Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3) Upload to Sanity as an image
    // If it's a general file, use "file" instead of "image" below
    const assetDoc = await client.assets.upload("image", buffer, {
      // Add a unique filename or fallback
      filename: file.name ?? `upload-${uuid()}`,
    });

    // assetDoc._id is the real asset ID, e.g. "image-123abc-...-jpg"
    return NextResponse.json({ assetId: assetDoc._id }, { status: 200 });
  } catch (err) {
    console.error("uploadImage route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
