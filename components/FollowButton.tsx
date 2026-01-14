"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
}

export default function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleFollow() {
    setIsLoading(true);
    // Lưu trạng thái cũ để nếu lỗi thì revert lại (Optimistic UI)
    const previousState = isFollowing;
    setIsFollowing(!isFollowing); 

    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: "POST",
      });

      if (!res.ok) {
          throw new Error("Lỗi khi follow");
      }

      router.refresh();
      toast.success(previousState ? "Đã bỏ theo dõi" : "Đã theo dõi");
      
    } catch (error) {
      setIsFollowing(previousState); 
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`
        px-6 py-2 rounded-lg font-semibold text-sm transition-all border
        ${isFollowing 
            ? "bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-700" 
            : "bg-black text-white border-transparent hover:bg-gray-800 dark:bg-white dark:text-black" 
        }
      `}
    >
      {isLoading ? "..." : (isFollowing ? "Đang theo dõi" : "Theo dõi")}
    </button>
  );
}