import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { client } from "@/app/lib/sanity"; // your existing sanity client

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // 1) Check if user already exists
    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2) Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3) Create user in Sanity
    const newUser = {
      _type: "user",
      email,
      passwordHash,
      name: name ?? "",
    };

    const result = await client.create(newUser);

    return NextResponse.json(
      { message: "User created successfully", userId: result._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
