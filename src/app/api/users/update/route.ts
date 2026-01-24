import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    const { firstName, lastName, bio } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();

    // Cập nhật thông tin vào Clerk
    await client.users.updateUser(userId, {
      firstName: firstName,
      lastName: lastName,
      // Lưu Bio vào metadata của Clerk (nơi an toàn để lưu info tùy chỉnh)
      unsafeMetadata: {
        bio: bio,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Lỗi cập nhật hồ sơ" }, { status: 500 });
  }
}