// app/api/user/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { client } from "@/app/lib/sanity";

// PATCH: Update user profile
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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

    const patchData: Record<string, unknown> = { name: name ?? "" };

    if (profileImageId) {
      patchData["profileImage"] = {
        _type: "image",
        asset: { _type: "reference", _ref: profileImageId },
      };
    }

    await client.patch(userDoc._id).set(patchData).commit();

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error("PATCH /api/user/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove user document
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userDoc = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email }
    );
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await client.delete(userDoc._id);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/user/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
