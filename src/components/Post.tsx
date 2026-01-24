"use client";

import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import Link from "next/link"; 
import LikeButton from "./LikeButton";
import { formatTime } from "@/lib/utils"; 

interface PostProps {
  _id: string; // Đổi id thành _id cho đồng bộ DB
  content: string;
  authorName: string;
  authorImage: string;
  authorId: string;
  createdAt: string; // Thêm trường thời gian
  initialLikes: string[]; 
  commentsCount: number; 
}

// Lưu ý: Đổi prop 'id' thành '_id' ở đây
export default function Post({ _id, authorName, authorImage, authorId, content, createdAt, initialLikes = [], commentsCount = 0 }: PostProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const isOwner = user?.id === authorId;

  async function handleDelete() {
    if (!confirm("Bạn có chắc muốn xóa bài viết này không?")) return;
    const toastId = toast.loading("Đang xóa...");

    try {
      const res = await fetch(`/api/posts/${_id}`, { method: "DELETE" }); // Dùng _id
      if (!res.ok) throw new Error("Lỗi xóa bài");

      toast.success("Đã xóa bài viết!", { id: toastId });

      if (pathname.includes("/posts/")) {
        router.push("/");
      } else {
        router.refresh(); 
      }
    } catch (error) {
      toast.error("Xóa thất bại", { id: toastId });
    }
  }

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      <Link href={`/profile/${authorId}`} className="shrink-0">
        <img src={authorImage} alt={authorName} className="w-10 h-10 rounded-full object-cover border border-gray-200 hover:opacity-80 transition-opacity"/>
      </Link>

      <div className="flex-1 group">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${authorId}`} className="font-bold text-base text-black dark:text-white hover:underline">{authorName}</Link>
            {/* 👇 DÙNG HÀM MỚI: Hiển thị thời gian đẹp hơn */}
            <span className="text-gray-400 text-sm">{formatTime(createdAt)}</span>
          </div>

          {isOwner && (
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          )}
        </div>

        <Link href={`/posts/${_id}`}>
          <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-snug mb-3 whitespace-pre-wrap wrap-break-words">
            {content}
          </p>
        </Link>
        
        <div className="flex gap-10 text-gray-500">
          <LikeButton postId={_id} initialLikes={initialLikes} />
          <Link href={`/posts/${_id}`} className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            {commentsCount > 0 && <span className="text-sm">{commentsCount}</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}