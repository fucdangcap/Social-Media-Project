import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cache } from "@/lib/cache";
import { revalidatePath } from "next/cache";

// Hàm xử lý lệnh DELETE (Xóa bài)
export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> } // Next.js 15: params là Promise
) {
  try {
    const params = await props.params;
    const user = await currentUser();

    // 1. Kiểm tra đăng nhập
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    await connectToDatabase();

    // 2. Tìm bài viết
    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    // 3. Kiểm tra quyền (Chính chủ mới được xóa)
    if (post.authorId !== user.id) {
      return NextResponse.json({ error: "Không có quyền xóa" }, { status: 403 });
    }

    // 4. Xóa bài viết
    await Post.findByIdAndDelete(params.id);
    
    // ✅ FIX: Clear cache và revalidate Next.js cache
    cache.deletePattern('posts_page_*');
    revalidatePath('/'); // Revalidate trang chủ
    revalidatePath(`/posts/${params.id}`); // Revalidate trang chi tiết

    // 5. Trả về thành công
    return NextResponse.json({ success: true, message: "Đã xóa thành công" });

  } catch (error) {
    console.error("Lỗi Server khi xóa:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}