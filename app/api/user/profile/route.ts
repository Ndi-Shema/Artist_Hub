import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { client } from "@/app/lib/sanity";

export async function PATCH(req: Request) {
  try {
    // 1) Validate user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Parse the request body
    const { name, profileImageId } = await req.json();

    // 3) Find the user's doc in Sanity by email
    const userDoc = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email: session.user.email }
    );
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4) Build patch data
    const patchData: any = { name: name ?? "" };

    // If we do have a new assetId from the upload route
    if (profileImageId) {
      patchData["profileImage"] = {
        _type: "image",
        asset: { _ref: profileImageId },
      };
    }

    // 5) Patch the user doc in Sanity
    await client.patch(userDoc._id).set(patchData).commit();

    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    console.error("PATCH /api/user/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * (Optional) DELETE route to remove user doc
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find doc
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
