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

// Dùng phương thức POST để thực hiện hành động Like
export async function POST(request: Request, props: Props) {
  try {
    // Kiểm tra đăng nhập
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const params = await props.params; 
    await connectToDatabase();

    // Tìm bài viết 
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    //Kiểm tra xem user đã like bài viết chưa
    const isLiked = post.likes.includes(user.id);

    let updatedPost;

    if (isLiked) {
      // Nếu đã like thì bỏ like (unlike)
      updatedPost = await Post.findByIdAndUpdate(
        params.id,
        { $pull: { likes: user.id } }, // Xóa user.id khỏi mảng likes
        { new: true } // Trả về bản cập nhật mới
      );

      await Notification.findOneAndDelete({
        recipientId: post.authorId,
        senderId: user.id,
        type: "like",
        postId: params.id,
      });
      
    } else {
      // Nếu chưa like thì thêm like
      updatedPost = await Post.findByIdAndUpdate(
        params.id,
        { $push: { likes: user.id } }, // Thêm user.id vào mảng likes
        { new: true } // Trả về bản cập nhật mới
      );
    
    // Tạo thông báo nếu là like
    if(post.authorId !== user.id && !isLiked) {
      await Notification.create({
        recipientId: post.authorId,
        senderId: user.id,
        senderName: user.firstName || user.username || "Someone",
        senderImg: user.imageUrl,
        type: "like",
        postId: params.id,
        read: false,
      });
    }
  }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Like error:", error); // Ghi log lỗi chi tiết
    return NextResponse.json({ error: "Lỗi like: " + error }, { status: 500 });
  }
}