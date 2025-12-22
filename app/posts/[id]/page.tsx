import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import Post from "@/app/Post";
import CommentSection from "@/app/CommentSection";
import { notFound } from "next/navigation";

// Hàm lấy dữ liệu tu server
async function getPost(id: String) {
    await connectToDatabase();
    const post = await PostModel.findById(id).lean();
    if (!post) return null;
    return post;
}

export default async function PostDetailPage(props: { params: { id: string } }) {
    const params = await props.params;
    const post = await getPost(params.id);

    if (!post) return notFound();

    //Chuyen doi du lieu MongoDB de truyen vao component
    const serializedPost = {
        id: post._id.toString(),
        content: post.content,
        authorName: post.authorName,
        authorImage: post.authorImage,
        authorId: post.authorId,
        likes: post.likes || [],
        comments: post.comments || [],
        commentsCount: post.comments ? post.comments.length : 0,
    };
    return (
    <div className="max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 min-h-screen pt-20 pb-10 bg-white dark:bg-gray-950">
      {/* 1. Hiển thị nội dung bài viết chính */}
      <Post 
        {...serializedPost} 
        initialLikes={serializedPost.likes} 
      />

      {/* 2. Hiển thị khu vực bình luận bên dưới */}
      <div className="px-4">
        <CommentSection 
          postId={serializedPost.id} 
          initialComments={serializedPost.comments} 
        />
      </div>
    </div>
  );
}
