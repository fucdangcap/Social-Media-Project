import Post from "./Post";
import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post"; // Đổi tên import để tránh trùng tên Component
import PostForm from "./PostForm";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Sign } from "crypto";

export const dynamic = "force-dynamic"; // Buộc trang này luôn là dynamic
// Hàm lấy dữ liệu từ Database
async function getPosts() {
  await connectToDatabase();
  // Tìm tất cả bài viết, sắp xếp mới nhất lên đầu (sort -1)
  // lean() giúp chuyển đổi từ Mongoose Object sang JSON thường cho nhẹ
  const posts = await PostModel.find({}).sort({ createdAt: -1 }).lean();
  
  // Chuyển đổi _id và ngày tháng sang dạng chuỗi để React không bị lỗi
  return posts.map((post: any) => ({
    id: post._id.toString(),
    content: post.content,
    // createdAt: post.createdAt.toString() (Tạm chưa dùng)
    likes: post.likes || [],
    authorName: post.authorName, 
    authorImage: post.authorImage,
    authorId: post.authorId,
  }));
}

// Chuyển component Home thành async để gọi được hàm lấy dữ liệu
export default async function Home() {
  // Gọi hàm lấy dữ liệu thật
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-10">
        <div className="max-w-lg mx-auto p-4 flex justify-between items-center">
          <h1 className="font-bold text-xl tracking-tighter">ThreadsLite</h1>
          <div>
          {/* Truong hop 1: Chua dang nhap */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Đăng nhập
              </button>
            </SignInButton>
          </SignedOut>

          {/* Truong hop 2: Da dang nhap */}
          <SignedIn>
            <UserButton />
          </SignedIn>
          </div>
        </div>
      </header>

      <div className="h-16"></div>

      <div className="max-w-lg mx-auto border-x border-gray-100 min-h-screen">
        {/* Form đăng bài */}
        <SignedIn>
        <PostForm />
        </SignedIn>

        <SignedOut>
          <div className="p-4 text-center bg-gray-50 text-gray-500 text-sm">
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
  />
        ))}
      </div>
    </div>
  );
}