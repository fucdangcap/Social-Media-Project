"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { createPost } from "@/actions/post"; // Import hàm vừa tạo
import Link from "next/link";

export default function PostForm() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hàm tự động giãn chiều cao textarea khi gõ xuống dòng
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  async function handleSubmit() {
    if (!content.trim()) return;
    setIsLoading(true);
    
    try {
      await createPost(content);
      setContent("");
      toast.success("Đã đăng bài!");
      
      // Reset chiều cao textarea
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      toast.error("Lỗi đăng bài");
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
      <Link href={`/profile/${user.id}`} className="shrink-0 pt-1">
        <img
          src={user.imageUrl}
          alt={user.username || "Avatar"}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
      </Link>

      <div className="flex-1 w-full">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Có gì mới không?"
          className=
          "w-full bg-transparent border-none outline-none focus:ring-0 text-[15px] placeholder-gray-400 text-black dark:text-white resize-none overflow-hidden min-h-10 py-2"
          value={content}
          onChange={handleInput}
          disabled={isLoading}
        />

        <div className="flex justify-end items-center mt-2">
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            className={`
              px-4 py-1.5 rounded-full font-semibold text-sm transition-all
              ${content.trim() 
                ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-90" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"}
            `}
          >
            {isLoading ? "Đang đăng..." : "Đăng"}
          </button>
        </div>
      </div>
    </div>
  );
}