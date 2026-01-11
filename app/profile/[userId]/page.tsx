import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import FollowModel from "@/models/Follow";
import Post from "@/app/Post"; 
import FollowButton from "@/components/FollowButton";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  // 1. Lấy ID từ đường dẫn (URL)
  const { userId } = await params;
  const { userId: currentUserId } = await auth(); // Lấy userId của người đang đăng nhập (nếu có)
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
  // Kiểm tra xem mình đã follow người này chưa?
  // (Nếu chưa đăng nhập hoặc xem profile chính mình thì mặc định là false)
  let isFollowing = false;
  if (currentUserId && currentUserId !== userId) {
    const follow = await FollowModel.findOne({
        followerId: currentUserId,
        followingId: userId
    });
    isFollowing = !!follow; // Convert sang boolean (true/false)
  }

  // 3. Đếm số lượng Follower / Following (Tạm thời đếm sơ sơ)
  const followersCount = await FollowModel.countDocuments({ followingId: userId });
  const followingCount = await FollowModel.countDocuments({ followerId: userId });

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
  // Lấy bio từ metadata của user
  const bio = (user.unsafeMetadata?.bio as string) || "Chưa có tiểu sử.";
  

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="p-8 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              {user.firstName} {user.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 dark:text-gray-400">
                    @{user.username || (user.emailAddresses[0]?.emailAddress?.split('@')[0])}
                </p>
                <span className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded-full text-gray-500">
                    threads.net
                </span>
            </div>
            
            {/* Phần hiển thị BIO */}
            <p className="mt-4 text-black dark:text-white whitespace-pre-wrap">
              {bio}
            </p>

            {/* Phần hiển thị số lượng Follow */}
            <div className="flex gap-4 mt-4 text-gray-500 text-sm">
                <span className="hover:underline cursor-pointer"><strong className="text-black dark:text-white">{followersCount}</strong> followers</span>
                <span className="hover:underline cursor-pointer"><strong className="text-black dark:text-white">{followingCount}</strong> following</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-4">
             <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
            />
            
            {/* NÚT FOLLOW: Chỉ hiện khi Đã đăng nhập & Không phải xem profile chính mình */}
            {currentUserId && currentUserId !== userId && (
                <FollowButton targetUserId={userId} initialIsFollowing={isFollowing} />
            )}
             {/* Nếu là chính mình thì hiện nút Sửa hồ sơ (Tạm để đó) */}
            {currentUserId === userId && (
                 <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    Edit Profile
                 </button>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        <div className="flex font-bold text-sm text-center border-b border-gray-200 dark:border-gray-800">
            <div className="flex-1 py-4 border-b-2 border-black dark:border-white text-black dark:text-white cursor-pointer">
                Threads
            </div>
            <div className="flex-1 py-4 text-gray-500 cursor-not-allowed">
                Replies
            </div>
            <div className="flex-1 py-4 text-gray-500 cursor-not-allowed">
                Reposts
            </div>
        </div>

        {serializedPosts.length > 0 ? (
          serializedPosts.map((post: any) => (
             <Post key={post.id} {...post} initialLikes={post.likes} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            Chưa có bài viết nào.
          </div>
        )}
      </div>
    </div>
  );
}