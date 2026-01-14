import connectToDatabase from "@/lib/db";
import Notification from "@/models/Notification";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    // Lấy thông báo gửi cho mình, sắp xếp mới nhất lên đầu
    const notifications = await Notification.find({ recipientId: user.id })
      .sort({ createdAt: -1 })
      .limit(20); // Lấy 20 cái mới nhất thôi cho nhẹ

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}