import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import FollowModel from "@/models/Follow";
import Post from "@/components/Post"; 
import FollowButton from "@/components/FollowButton";
import ProfileHeader from "@/components/ProfileHeader";
import { notFound } from "next/navigation";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const { userId: currentUserId } = await auth();
  let user;
  try {
    const client = await clerkClient();
    user = await client.users.getUser(userId);
  } catch (error) {
    return notFound();
  }

  await connectToDatabase();
  
  const posts = await PostModel.find({ authorId: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('_id content authorId authorName authorImage likes comments createdAt')
    .lean();

  let isFollowing = false;
  if (currentUserId && currentUserId !== userId) {
    const follow = await FollowModel.findOne({
        followerId: currentUserId,
        followingId: userId
    });
    isFollowing = !!follow;
  }

  // Đếm số lượng Follower / Following
  const followersCount = await FollowModel.countDocuments({ followingId: userId });
  const followingCount = await FollowModel.countDocuments({ followerId: userId });

  const serializedPosts = posts.map((post: any) => ({
    id: post._id.toString(),
    content: post.content,
    authorId: post.authorId,
    authorName: post.authorName,
    authorImage: post.authorImage,
    likes: post.likes || [],
    commentsCount: post.comments ? post.comments.length : 0,
  }));

  const serializedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      emailAddresses: user.emailAddresses.map((e) => ({ emailAddress: e.emailAddress })),
      imageUrl: user.imageUrl,
      unsafeMetadata: user.unsafeMetadata,
  };
  

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      
      <ProfileHeader 
        user={serializedUser}
        currentUserId={currentUserId}
        isFollowing={isFollowing}
        followersCount={followersCount}
        followingCount={followingCount}
      />

      {/* Danh sách bài viết */}
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        <div className="flex font-bold text-sm text-center border-b border-gray-200 dark:border-gray-800">
            <div className="flex-1 py-4 border-b-2 border-black dark:border-white text-black dark:text-white cursor-pointer">
                Threads
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