import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";

type Props = {
    params: Promise<{
        id: string;
    }>; 
};

export async function POST(request: Request, props: Props){
    try {
        // Kiểm tra đăng nhập
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
        }

        // Lay noi dung cmt
        const { content, replyTo } = await request.json();
        if (!content || content.trim() === " "){
            return NextResponse.json({ error: "Nội dung trống" }, { status: 400 });
        }

        const params = await props.params; // Nhớ await params
        await connectToDatabase();

        const commentId = new mongoose.Types.ObjectId().toString(); // Tạo ID cho bình luận mới

        // Tìm bài viết và PUSH bình luận vào mảng comment
        const updatedPost = await Post.findByIdAndUpdate(
            params.id,
            {
                $push: { 
                    comment: {
                        _id: commentId,
                        authorId: user.id,
                        authorName: user.firstName || user.username || "Anonymous",
                        authorImage: user.imageUrl,
                        content: content,
                        replyTo: replyTo || null,
                    },
                },
            },
            { new: true } // Trả về bản cập nhật mới
        );

        if (!updatedPost) return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 }); 
        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: "Lỗi bình luận: " + error }, { status: 500 });
    }
}