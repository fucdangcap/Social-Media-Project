import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import Post from "@/components/Post";
import CommentSection from "@/components/CommentSection";
import { notFound } from "next/navigation";
import { serializeData } from "@/lib/utils"; // 👈 Import hàm mới
import { IPost } from "@/types"; // 👈 Import Type chuẩn

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage(props: Props) {
  const params = await props.params;
  if (!params?.id) return notFound();

  await connectToDatabase();

  const postRaw = await PostModel.findById(params.id).lean();
  if (!postRaw) return notFound();

  // 👇 DÙNG HÀM MỚI: Code siêu gọn, không lo lỗi Plain Object
  const post = serializeData<IPost>(postRaw);

  return (
    <div className="max-w-2xl mx-auto border-x border-gray-100 dark:border-gray-800 min-h-screen pt-20 pb-10 bg-white dark:bg-black">
      <Post 
        {...post} // Truyền toàn bộ props khớp với Interface IPost
        initialLikes={post.likes}
        commentsCount={post.comments?.length || 0}
      />

      <div className="px-4">
        <CommentSection 
            postId={post._id}
            comments={post.comments || []}
            postAuthorId={post.authorId}
        />
      </div>
    </div>
  );
}