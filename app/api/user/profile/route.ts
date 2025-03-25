import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";import { client } from "@/app/lib/sanity";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions); // ✅ Safe import now
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, profileImageId } = await req.json();

    const userDoc = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email }
    );

    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const patchData: any = { name: name ?? "" };
    if (profileImageId) {
      patchData["profileImage"] = {
        _type: "image",
        asset: { _ref: profileImageId },
      };
    }

    await client.patch(userDoc._id).set(patchData).commit();

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error("PATCH /api/user/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
