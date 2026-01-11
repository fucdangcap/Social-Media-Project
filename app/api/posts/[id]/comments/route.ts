import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    const { content } = await req.json();

    if (!userId || !content) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    await connectToDatabase();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const newComment = {
      content: content,
      authorId: userId,
      authorName: user.firstName ? `${user.firstName} ${user.lastName}` : user.username,
      authorImage: user.imageUrl,
      createdAt: new Date(),
    };

    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true }
    );

    if (!updatedPost) {
        return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    return NextResponse.json({ success: true, newComment });
  } catch (error) {
    console.error("Comment error:", error);
    return NextResponse.json({ error: "Lỗi Server" }, { status: 500 });
  }
}