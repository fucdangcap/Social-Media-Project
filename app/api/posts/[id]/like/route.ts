import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// Dùng phương thức POST để thực hiện hành động Like
export async function POST(request: Request, props: Props) {
  try {
    const params = await props.params; // Nhớ await params (Next.js 15)
    await connectToDatabase();

    // Tìm bài viết và tăng like lên 1 ($inc là lệnh của MongoDB)
    const updatedPost = await Post.findByIdAndUpdate(
      params.id,
      { $inc: { likes: 1 } }, // Tăng likes thêm 1
      { new: true } // Trả về dữ liệu mới nhất sau khi tăng
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Không tìm thấy bài" }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi like: " + error }, { status: 500 });
  }
}