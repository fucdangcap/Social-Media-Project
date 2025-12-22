"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
        toast.error("Bạn chưa viết gì cả!");
        return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Lỗi khi đăng bài");
      }

      setContent("");
      toast.success("Đăng bài thành công!");
      router.refresh();

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;

  return (
    // 1. SỬA CONTAINER: Thêm bg-white dark:bg-gray-950 và viền tối dark:border-gray-800
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex gap-4">
      
      {/* Cột trái: Avatar */}
      <div className="shrink-0">
        <img 
            src={user.imageUrl} 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
      </div>

      {/* Cột phải: Ô nhập liệu + Nút đăng */}
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Có gì mới không?"
          // 2. SỬA TEXTAREA: Thêm bg-transparent, text-black và dark:text-white
          className="w-full h-24 p-2 outline-none resize-none placeholder-gray-400 text-base bg-transparent text-black dark:text-white"
          disabled={isLoading}
        />
        
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            // 3. SỬA NÚT BẤM: Thêm dark:bg-white dark:text-black (đảo màu cho nổi)
            className={`
              px-5 py-2 rounded-full font-bold text-sm transition-all
              ${isLoading || !content.trim() 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600" 
                : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              }
            `}
          >
            {isLoading ? "Đang đăng..." : "Đăng"}
          </button>
        </div>
      </div>
    </form>
  );
}