import { NextResponse } from "next/server";
import { client } from "@/app/lib/sanity";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const productTitle = formData.get("product") as string;
    const imageFile = formData.get("image") as File;

    if (!name || !email || !phone || !productTitle || !imageFile) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const imageBuffer = await imageFile.arrayBuffer();
    const uploadedImage = await client.assets.upload("image", Buffer.from(imageBuffer), {
      filename: imageFile.name,
      contentType: imageFile.type,
    });

    const submissionDoc = {
      _type: "submission",
      name,
      contact: `${email} | ${phone}`,
      productTitle,
      productDescription: productTitle,
      productImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: uploadedImage._id,
        },
      },
      submittedAt: new Date().toISOString(),
    };

    await client.create(submissionDoc);
    return NextResponse.json({ message: "Submission received!" });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
