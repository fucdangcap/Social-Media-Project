import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// Hàm xử lý lệnh DELETE
export async function DELETE(request: Request, props: Props) {
  try {
    // 1. Phải await params trước khi lấy ID (Đây là chỗ sửa lỗi)
    const params = await props.params;
    const id = params.id;

    await connectToDatabase();
    
    // Tìm bài viết theo ID và xóa nó
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    return NextResponse.json({ message: "Đã xóa thành công!" });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi xóa bài: " + error }, { status: 500 });
  }
}