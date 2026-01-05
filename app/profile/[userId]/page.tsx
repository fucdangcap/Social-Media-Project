import { clerkClient } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import Post from "@/app/Post"; 
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  // 1. Lấy ID từ đường dẫn (URL)
  const { userId } = await params;

  // 2. Lấy thông tin User từ Clerk
  let user;
  try {
    const client = await clerkClient();
    user = await client.users.getUser(userId);
  } catch (error) {
    // Nếu không tìm thấy user trên Clerk -> Trả về trang 404
    return notFound();
  }

  // 3. Lấy danh sách bài viết của User đó từ MongoDB
  await connectToDatabase();
  const posts = await PostModel.find({ authorId: userId }).sort({ createdAt: -1 });

  // Convert dữ liệu MongoDB sang dạng đơn giản để React hiểu
  const serializedPosts = posts.map((post: any) => ({
    id: post._id.toString(),
    content: post.content,
    authorId: post.authorId,
    authorName: post.authorName,
    authorImage: post.authorImage,
    likes: post.likes || [],
    commentsCount: post.comments ? post.comments.length : 0,
  }));

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* PHẦN ĐẦU: Thông tin cá nhân (Header) */}
      <div className="p-8 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
                {/* Xử lý an toàn: Nếu không có username thì lấy email làm tên hiển thị */}
                @{user.username || (user.emailAddresses[0]?.emailAddress?.split('@')[0])}
            </p>
          </div>
          <img 
            src={user.imageUrl} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
          />
        </div>
        
        <p className="mt-4 text-black dark:text-white">
          Thành viên của ThreadsLite.
        </p>
      </div>

      {/* PHẦN DƯỚI: Danh sách bài viết */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {/* Tab chuyển đổi */}
        <div className="flex font-bold text-sm text-center border-b border-gray-200 dark:border-gray-800">
            <div className="flex-1 py-4 border-b-2 border-black dark:border-white text-black dark:text-white cursor-pointer">
                Threads ({serializedPosts.length})
            </div>
            <div className="flex-1 py-4 text-gray-500 cursor-not-allowed">
                Replies
            </div>
        </div>

        {/* In danh sách bài viết */}
        {serializedPosts.length > 0 ? (
          serializedPosts.map((post: any) => (
             <Post key={post.id} {...post} initialLikes={post.likes} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            Người dùng này chưa đăng bài viết nào.
          </div>
        )}
      </div>
    </div>
  );
}