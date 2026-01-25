import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import Notification from "@/models/Notification";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { isRateLimited } from "@/lib/rateLimit"; // ✅ Import
import mongoose from "mongoose";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    // ✅ RATE LIMIT: Chống spam comment (20 comment/phút)
    if (isRateLimited(`comment_${user.id}`, 20, 60 * 1000)) {
      return NextResponse.json(
        { error: "Bình luận quá nhanh! Chờ chút nhé." },
        { status: 429 }
      );
    }

    const body = await req.json();
    if (!body.content) return NextResponse.json({ error: "Empty content" }, { status: 400 });

    await connectToDatabase();
    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // 1. TẠO ID MỚI
    const newCommentId = new mongoose.Types.ObjectId();
    const now = new Date();

    // 2. TẠO DATA ĐỂ LƯU DB (Giữ nguyên ObjectId và Date để Mongoose hiểu)
    const commentForDB = {
      _id: newCommentId,
      content: body.content,
      authorName: user.firstName || "User",
      authorImage: user.imageUrl,
      createdAt: now,
      authorId: user.id,
    };

    // 3. TẠO DATA ĐỂ BẮN PUSHER (⚠️ QUAN TRỌNG: Ép hết về String)
    // Đây là bước sửa lỗi tận gốc: Pusher sẽ không bị lỗi khi nhận chuỗi thuần
    const commentForPusher = {
      ...commentForDB,
      _id: newCommentId.toString(),   // Ép về string
      createdAt: now.toISOString(),   // Ép về string ISO
    };

    // 4. LƯU VÀO DB
    post.comments.push(commentForDB);
    await post.save();

    // 5. BẮN PUSHER (Dùng biến commentForPusher đã sạch sẽ)
    // Nếu Pusher config đúng, dòng này giờ sẽ chạy mượt vì dữ liệu sạch
    await pusherServer.trigger(`post_${params.id}`, "new-comment", commentForPusher);

    // 6. XỬ LÝ THÔNG BÁO
    if (post.authorId !== user.id) {
      // Lưu thông báo
      await Notification.create({
        recipientId: post.authorId,
        actorId: user.id,
        actorName: user.firstName || "Ai đó",
        actorImage: user.imageUrl,
        type: "comment",
        postId: post._id, // Mongoose tự xử lý ObjectId ở đây ok
        message: `đã bình luận bài viết của bạn.`,
      });

      // Bắn Pusher thông báo (Cũng chỉ gửi tin hiệu đơn giản)
      await pusherServer.trigger(`user_${post.authorId}`, "new-notification", {
        hasNotification: true 
      });
    }

    return NextResponse.json({ success: true, newComment: commentForPusher });

  } catch (error: any) {
    // Nếu vẫn lỗi, in chi tiết ra terminal để bắt tận tay
    console.error("🔥 LỖI CHẾT NGƯỜI TẠI API COMMENT:", error);
    
    // Check xem lỗi do đâu
    if (error.status) console.error("👉 Lỗi từ Pusher:", error.status, error.body);
    
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}