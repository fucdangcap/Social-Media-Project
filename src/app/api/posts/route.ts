import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { currentUser } from "@clerk/nextjs/server";

// Hàm xử lý khi Frontend gửi yêu cầu GET (Lấy danh sách bài viết)
export async function GET() {
  await connectToDatabase();
  const posts = await Post.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(posts);
}

// Hàm xử lý khi Frontend gửi yêu cầu POST (Đăng bài)
export async function POST(request: Request) {
  try {
    // 1. Kiểm tra người dùng đã đăng nhập chưa
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Bạn phải đăng nhập để đăng bài"},
        { status: 401 }
      );
    }
    const { content } = await request.json();
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Nội dung trống" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const newPost = await Post.create({
      content,
      authorId: user.id,
      authorName: user.firstName || "Người dùng",
      authorImage: user.imageUrl,
    });
    return NextResponse.json({ message: "Đăng thành công!", post: newPost });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server: " + error }, { status: 500 });
  }
}
