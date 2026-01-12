"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Comment {
    content: string;
    authorName: string;
    authorImage: string;
    createdAt: string;
}

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
}

export default function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const { user } = useUser();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments || []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return toast.error("Vui lòng đăng nhập để bình luận");
    if (!content.trim()) return;

    setIsLoading(true);

    try {
      // Gọi API mà chúng ta vừa tạo ở bước trước
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Lỗi gửi bình luận");

      const data = await res.json();
      
      // Cập nhật giao diện ngay lập tức
      setComments((prev) => [...prev, data.newComment]);
      
      setContent(""); 
      toast.success("Đã gửi bình luận!");
      router.refresh(); 

    } catch (error) {
      console.error(error);
      toast.error("Gửi thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
      {/* Form nhập bình luận */}
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        {user && (
            <img src={user.imageUrl} className="w-8 h-8 rounded-full border border-gray-200" />
        )}
        <div className="flex-1 relative">
            <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-gray-300 dark:text-white"
            disabled={isLoading}
            />
            {content.trim() && (
                <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 font-bold text-sm hover:text-blue-700"
                    disabled={isLoading}
                >
                    Gửi
                </button>
            )}
        </div>
      </form>

      {/* Danh sách bình luận */}
      <div className="space-y-4">
        {comments?.map((comment, index) => {
          // Nếu comment bị rỗng (null/undefined) thì bỏ qua ngay, không vẽ ra nữa
          if (!comment) return null; 

          return (
            <div key={index} className="flex gap-3">
              <img 
                src={comment.authorImage} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-gray-200 object-cover" 
              />
              <div>
                <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-2xl rounded-tl-none">
                  <span className="font-bold text-sm block text-black dark:text-white">
                    {comment.authorName}
                  </span>
                  <p className="text-sm text-gray-800 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}