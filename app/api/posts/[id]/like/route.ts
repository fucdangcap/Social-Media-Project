import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
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

    const params = await props.params; // Nhớ await params 
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
    } else {
      // Nếu chưa like thì thêm like
      updatedPost = await Post.findByIdAndUpdate(
        params.id,
        { $push: { likes: user.id } }, // Thêm user.id vào mảng likes
        { new: true } // Trả về bản cập nhật mới
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi like: " + error }, { status: 500 });
  }
}