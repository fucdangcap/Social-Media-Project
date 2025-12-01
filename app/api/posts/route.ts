import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Post from "@/app/models/Post";

// Hàm xử lý khi Frontend gửi yêu cầu POST (Đăng bài)
export async function POST(request: Request) {
  try {
    // 1. Đọc dữ liệu gửi lên
    const body = await request.json();
    const { content, author } = body;

    // 2. Kiểm tra xem có nhập thiếu gì không
    if (!content || !author) {
      return NextResponse.json(
        { error: "Nội dung và Tác giả là bắt buộc" }, 
        { status: 400 }
      );
    }

    // 3. Kết nối DB và Lưu bài mới
    await connectToDatabase();
    const newPost = await Post.create({ content, author });

    // 4. Trả về kết quả thành công
    return NextResponse.json({ message: "Đăng thành công!", post: newPost });
    
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server: " + error }, { status: 500 });
  }
}