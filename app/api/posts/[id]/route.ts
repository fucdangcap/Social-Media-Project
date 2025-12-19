import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

// Hàm xử lý lệnh DELETE
export async function DELETE(request: Request, props: Props) {
  try {
    // Kiểm tra người dùng đã đăng nhập chưa
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 });
    }
    //Phải await params trước khi lấy ID (Đây là chỗ sửa lỗi)
    const params = await props.params;
    const id = params.id;
    await connectToDatabase();

    // Tìm bài viết xem có tồn tại không
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Bài viết không tồn tại" }, { status: 404 });
    }
    // Check nếu người xóa không phải là tác giả bài viết
    if (post.authorId !== user.id) {
      return NextResponse.json(
        { error: "Bạn không có quyền xóa bài này!" }, 
        { status: 403 } // 403: Forbidden (Cấm)
      );
    }

    await Post.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Đã xóa thành công!" });

  } catch (error) {
    return NextResponse.json({ error: "Lỗi xóa bài: " + error }, { status: 500 });
  }
}