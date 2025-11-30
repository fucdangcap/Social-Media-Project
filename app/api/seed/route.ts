import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Post from "@/app/models/Post";

export async function GET() {
  try {
    // 1. Kết nối DB
    await connectToDatabase();

    // 2. Xóa hết dữ liệu cũ (cho sạch sẽ)
    await Post.deleteMany({});

    // 3. Tạo dữ liệu mới
    await Post.create([
      { author: "Elon Musk", content: "ThreadsLite chạy nhanh hơn X nhiều! 🚀" },
      { author: "Mark Zuckerberg", content: "Tôi cũng phải học code Next.js thôi." },
      { author: "Admin", content: "Chào mừng đến với cơ sở dữ liệu MongoDB!" },
    ]);

    return NextResponse.json({ message: "✅ Đã bơm dữ liệu mẫu thành công!" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi rồi: " + error }, { status: 500 });
  }
}