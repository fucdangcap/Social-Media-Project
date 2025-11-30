import Post from "./Post";
import connectToDatabase from "@/app/lib/db";
import PostModel from "@/app/models/Post"; // Đổi tên import để tránh trùng tên Component

// Hàm lấy dữ liệu từ Database
async function getPosts() {
  await connectToDatabase();
  // Tìm tất cả bài viết, sắp xếp mới nhất lên đầu (sort -1)
  // lean() giúp chuyển đổi từ Mongoose Object sang JSON thường cho nhẹ
  const posts = await PostModel.find({}).sort({ createdAt: -1 }).lean();
  
  // Chuyển đổi _id và ngày tháng sang dạng chuỗi để React không bị lỗi
  return posts.map((post: any) => ({
    id: post._id.toString(),
    author: post.author,
    content: post.content,
    // createdAt: post.createdAt.toString() (Tạm chưa dùng)
  }));
}

// Chuyển component Home thành async để gọi được hàm lấy dữ liệu
export default async function Home() {
  // Gọi hàm lấy dữ liệu thật
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-10">
        <div className="max-w-lg mx-auto p-4 flex justify-center">
          <h1 className="font-bold text-xl">ThreadsLite</h1>
        </div>
      </header>

      <div className="h-16"></div>

      <div className="max-w-lg mx-auto border-x border-gray-100 min-h-screen">
        {/* Nếu chưa có bài nào thì báo */}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Chưa có bài viết nào.</p>
        )}

        {/* Có bài thì in ra */}
        {posts.map((post) => (
          <Post 
            key={post.id} 
            author={post.author} 
            content={post.content} 
          />
        ))}
      </div>
    </div>
  );
}