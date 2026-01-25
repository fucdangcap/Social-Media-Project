import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import PostForm from "@/components/PostForm";
import LoadMorePosts from "@/components/LoadMorePosts"; // 👈 Component mới
import { serializeData } from "@/lib/utils";
import { IPost } from "@/types";

export default async function Home() {
  await connectToDatabase();

  // ✅ OPTIMIZE: Chỉ load 20 posts đầu tiên thay vì tất cả
  const postsRaw = await PostModel.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .select('authorId authorName authorImage content likes comments createdAt') // Chỉ lấy fields cần thiết
    .lean();
  const posts = serializeData<IPost[]>(postsRaw);

  return (
    <div className="max-w-xl mx-auto border-x border-gray-100 dark:border-gray-800 min-h-screen">
      
      {/* 👇 Form đăng bài mới */}
      <PostForm />

      {/* 👇 Danh sách bài viết với nút "Xem thêm" */}
      <div>
        <LoadMorePosts initialPosts={posts} />
      </div>
    </div>
  );
}