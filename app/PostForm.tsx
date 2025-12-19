"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // Lấy thông tin user để hiện avatar
import toast from "react-hot-toast";

export default function PostForm() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser(); // Hook của Clerk

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // 1. Validate cơ bản: Không cho đăng nếu nội dung rỗng
    if (!content.trim()) {
        toast.error("Bạn chưa viết gì cả!");
        return;
    }

    setIsLoading(true);

    try {
      // 2. Gọi API
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      // 3. QUAN TRỌNG: Kiểm tra xem Server có trả về lỗi không
      // Nếu res.ok là false (ví dụ lỗi 401, 500) thì ném lỗi xuống catch
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Lỗi khi đăng bài");
      }

      // 4. Nếu thành công:
      setContent(""); // Xóa trắng ô nhập
      toast.success("Đăng bài thành công!");
      router.refresh(); // F5 nhẹ lại dữ liệu để bài mới hiện ra ngay

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false); // Luôn tắt loading dù thành công hay thất bại
    }
  }

  // Nếu chưa load xong user thì hiện khung skeleton đơn giản (tùy chọn)
  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100 flex gap-4">
      {/* Cột trái: Avatar người dùng */}
      <div className="flex-shrink-0">
        <img 
            src={user.imageUrl} 
            alt="User Avatar" 
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
      </div>

      {/* Cột phải: Ô nhập liệu + Nút đăng */}
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Có gì mới không?"
          className="w-full h-24 p-2 outline-none resize-none placeholder-gray-400 text-base"
          disabled={isLoading} // Khóa ô nhập khi đang gửi
        />
        
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className={`
              px-5 py-2 rounded-full font-bold text-sm transition-all
              ${isLoading || !content.trim() 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed" // Style khi disable
                : "bg-black text-white hover:bg-gray-800"        // Style khi active
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