import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import Post from "@/components/Post";
import { notFound } from "next/navigation";
import CommentSection from "@/components/CommentSection";
// Định nghĩa kiểu params cho Next.js 15
interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage(props: Props) {
  // 1. Xử lý Params (Next.js 15 bắt buộc phải await)
  const params = await props.params;
  
  // Kiểm tra an toàn: Nếu không có ID thì chặn luôn
  if (!params?.id) return notFound();

  await connectToDatabase();

  // 2. Lấy dữ liệu thô
  const postRaw = await PostModel.findById(params.id).lean();

  if (!postRaw) return notFound();

  // 🔥 3. BIỆN PHÁP MẠNH: "Luộc chín" toàn bộ dữ liệu
  // Lệnh này biến mọi thứ (ObjectId, Date,...) thành String/JSON thuần túy
  // Đảm bảo React không bao giờ báo lỗi "Only plain objects..." nữa
  const post = JSON.parse(JSON.stringify(postRaw));

  return (
    <div className="max-w-lg mx-auto border-x border-gray-100 dark:border-gray-800 min-h-screen pt-20 pb-10 bg-white dark:bg-black">
      {/* 4. Truyền dữ liệu vào (Mapping rõ ràng từng cái cho chắc ăn) */}
      <Post 
        id={post._id}
        content={post.content}
        authorName={post.authorName || "Anonymous"}
        authorImage={post.authorImage || "/no-avatar.png"}
        authorId={post.authorId}
        initialLikes={post.likes || []}
        commentsCount={post.comments?.length || 0}
      />
      {/* 5. Phần bình luận */}
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