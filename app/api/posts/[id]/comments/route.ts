import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import Notification from "@/models/Notification";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST ( req: Request, props: Props ) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const params = await props.params;
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Nội dung trống" }, { status: 400 });
    }

    await connectToDatabase();

    const newComment = {
      content: content,
      authorId: user.id,
      authorName: user.firstName || user.username || "Người dùng ẩn danh",
      authorImage: user.imageUrl,
      createdAt: new Date(),
    };

    // 4. Tìm bài viết và đẩy comment vào mảng "comments"
    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      { 
        $push: { comments: newComment } 
      },
      { new: true } // Trả về dữ liệu mới nhất
    );

    if (!updatedPost) {
        return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    // Nếu người comment KHÁC chủ bài viết thì mới báo
    if (updatedPost.authorId !== user.id) {
      await Notification.create({
        recipientId: updatedPost.authorId, 
        senderId: user.id,                 
        senderName: user.firstName || user.username || "Người dùng",
        senderImage: user.imageUrl,
        type: "comment",
        postId: params.id,
        read: false,
      });
    }

    // Trả về comment mới để Frontend hiển thị ngay lập tức
    return NextResponse.json({ success: true, newComment });

  } catch (error) {
    console.error("Lỗi comment:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}