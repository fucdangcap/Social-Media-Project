import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import Post from "@/components/Post";
import PostForm from "@/components/PostForm"; // 👈 Import form mới
import { serializeData } from "@/lib/utils";
import { IPost } from "@/types";

export default async function Home() {
  await connectToDatabase();

  const postsRaw = await PostModel.find().sort({ createdAt: -1 }).lean();
  const posts = serializeData<IPost[]>(postsRaw);

  return (
    <div className="max-w-xl mx-auto border-x border-gray-100 dark:border-gray-800 min-h-screen">
      
      {/* 👇 Form đăng bài mới (Ẩn đi phần background thô kệch cũ) */}
      <PostForm />

      {/* Danh sách bài viết */}
      <div>
        {posts.map((post) => (
          <Post 
             key={post._id}
             _id={post._id}
             createdAt={post.createdAt}
             content={post.content}
             authorName={post.authorName}
             authorImage={post.authorImage}
             authorId={post.authorId}
             initialLikes={post.likes || []}
             commentsCount={post.comments?.length || 0}
          />
        ))}

        {posts.length === 0 && (
          <div className="text-center py-20">
             <p className="text-gray-400">Chưa có bài viết nào.</p>
             <p className="text-sm text-gray-500">Hãy là người đầu tiên!</p>
          </div>
        )}
      </div>
    </div>
  );
}