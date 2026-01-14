import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const params = await props.params;
    const user = await currentUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    // 1. Tìm comment
    const commentToDelete = post.comments.find(
      (c: any) => c._id.toString() === params.commentId
    );

    if (!commentToDelete) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 2. Check quyền (Chính chủ hoặc Chủ nhà)
    const isCommentAuthor = commentToDelete.authorId === user.id;
    const isPostOwner = post.authorId === user.id;

    if (!isCommentAuthor && !isPostOwner) {
      return NextResponse.json({ error: "No permission" }, { status: 403 });
    }

    // 3. Xóa comment (Dùng filter)
    post.comments = post.comments.filter(
      (c: any) => c._id.toString() !== params.commentId
    );

    // 4. Báo Mongoose lưu thay đổi
    post.markModified('comments'); 
    await post.save();

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}