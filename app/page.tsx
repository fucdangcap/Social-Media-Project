import Post from "../components/Post";
import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post"; 
import PostForm from "../components/PostForm";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = "force-dynamic"; 

// Hàm lấy dữ liệu từ Database
async function getPosts() {
  await connectToDatabase();
  const posts = await PostModel.find({}).sort({ createdAt: -1 }).lean();
  
  // Chuyển đổi _id và ngày tháng sang dạng chuỗi để React không bị lỗi
  return posts.map((post: any) => ({
    id: post._id.toString(),
    content: post.content,
    // createdAt: post.createdAt.toString()
    likes: post.likes || [],
    authorName: post.authorName, 
    authorImage: post.authorImage,
    authorId: post.authorId,
    commentsCount: post.comments ? post.comments.length : 0,
  }));
}


export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-950 dark:text-white">

      {/* Cột nội dung chính: Thêm dark:border-gray-800 để viền tối đi */}
      <div className="max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 min-h-screen">
        
        {/* Form đăng bài (Chỉ hiện khi đã đăng nhập) */}
        <SignedIn>
          <PostForm />
        </SignedIn>

        {/* Thông báo chưa đăng nhập: Thêm dark:bg-gray-900 dark:text-gray-400 */}
        <SignedOut>
          <div className="p-4 text-center bg-gray-50 text-gray-500 text-sm dark:bg-gray-900 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
             Đăng nhập để viết bài mới bạn nhé!
          </div>
        </SignedOut>

        {/* Nếu chưa có bài nào thì báo */}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Chưa có bài viết nào.</p>
        )}

        {/* Có bài thì in ra */}
        {posts.map((post) => (
          <Post 
            key={post.id} 
            id={post.id}
            authorName={post.authorName} 
            authorImage={post.authorImage} 
            authorId={post.authorId}
            content={post.content} 
            initialLikes={post.likes}
            commentsCount={post.commentsCount}
          />
        ))}
      </div>
    </div>
  );
}