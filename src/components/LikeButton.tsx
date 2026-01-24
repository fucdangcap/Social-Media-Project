"use client";
import { useState, useEffect } from "react";
import { pusherClient } from "@/lib/pusher";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function LikeButton({ postId, initialLikes }: { postId: string, initialLikes: string[] }) {
  const { user } = useUser();
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const isLiked = user ? likes.includes(user.id) : false;

  useEffect(() => {
    const channel = pusherClient.subscribe(`post_${postId}`);
    channel.bind("update-likes", (data: any) => setLikes(data.likes));
    return () => pusherClient.unsubscribe(`post_${postId}`);
  }, [postId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) return toast.error("Cần đăng nhập!");
    if (isLoading) return;

    // Optimistic UI
    if (isLiked) setLikes(prev => prev.filter(id => id !== user.id));
    else setLikes(prev => [...prev, user.id]);

    setIsLoading(true);
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    } catch {
      setLikes(initialLikes); // Revert nếu lỗi
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleLike} disabled={isLoading} className={`flex gap-1 ${isLiked ? "text-red-500" : "text-gray-500"}`}>
       {/* Icon tim */}
       <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
       </svg>
       <span className={likes.length > 0 ? "" : "hidden"}>{likes.length}</span>
    </button>
  );
}