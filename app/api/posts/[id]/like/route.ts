import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import Notification from "@/models/Notification"; // 👈 Import cái này
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();
    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isLiked = post.likes.includes(user.id);

    if (isLiked) {
      post.likes = post.likes.filter((id: string) => id !== user.id);
      // (Optional) Nếu muốn xóa thông báo khi bỏ like thì thêm code xóa ở đây
    } else {
      post.likes.push(user.id);

      // 🔥 LƯU THÔNG BÁO VÀO DB (Chỉ khi không tự like bài mình)
      if (post.authorId !== user.id) {
        await Notification.create({
          recipientId: post.authorId,
          actorId: user.id,
          actorName: user.firstName || "Ai đó",
          actorImage: user.imageUrl,
          type: "like",
          postId: post._id,
          message: `đã thích bài viết của bạn.`,
        });

        // Bắn Pusher báo hiệu (Giữ nguyên)
        await pusherServer.trigger(`user_${post.authorId}`, "new-notification", { hasNotification: true });
      }
    }

    await post.save();
    await pusherServer.trigger(`post_${params.id}`, "update-likes", { likes: post.likes });

    return NextResponse.json({ success: true, likes: post.likes });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}