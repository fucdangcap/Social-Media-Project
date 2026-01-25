import connectToDatabase from "@/lib/db";
import Notification from "@/models/Notification";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    // ✅ OPTIMIZE: Chỉ select fields cần thiết + giới hạn 20 items
    const notifications = await Notification.find({ recipientId: user.id })
      .select('actorId actorName actorImage type message postId createdAt isRead')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // Lấy plain object thay vì Mongoose document

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}