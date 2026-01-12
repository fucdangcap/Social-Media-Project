import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; 
import connectToDatabase from "@/lib/db";
import Follow from "@/models/Follow";
import Notification from "@/models/Notification";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await currentUser();
    const { userId: targetUserId } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.id === targetUserId) {
      return NextResponse.json({ error: "Không thể tự follow chính mình" }, { status: 400 });
    }

    await connectToDatabase();

    const existingFollow = await Follow.findOne({
      followerId: user.id,
      followingId: targetUserId,
    });

    if (existingFollow) {
      // --- UNFOLLOW (Hủy theo dõi) ---
      await Follow.findByIdAndDelete(existingFollow._id);
      
      await Notification.findOneAndDelete({
        recipientId: targetUserId,
        senderId: user.id,
        type: "follow",
      });

      return NextResponse.json({ isFollowing: false });
    } else {

      // --- FOLLOW (Theo dõi) ---
      await Follow.create({
        followerId: user.id,
        followingId: targetUserId,
      });

      await Notification.create({
        recipientId: targetUserId, 
        senderId: user.id,
        senderName: user.firstName || user.username || "Người dùng",
        senderImage: user.imageUrl,
        type: "follow",
        
        read: false,
      });

      return NextResponse.json({ isFollowing: true });
    }
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}