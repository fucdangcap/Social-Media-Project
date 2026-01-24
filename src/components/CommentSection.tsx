"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { pusherClient } from "@/lib/pusher";
import { IComment } from "@/types"; // 👈 Dùng Type chuẩn
import { PUSHER_EVENTS } from "@/lib/constants"; // 👈 Dùng Constants
import { formatTime } from "@/lib/utils";

interface Props {
  postId: string;
  comments: IComment[];
  postAuthorId: string;
}

export default function CommentSection({ postId, comments, postAuthorId }: Props) {
  const { user } = useUser();
  const [commentList, setCommentList] = useState<IComment[]>(comments);
  const [inputContent, setInputContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 👇 DÙNG CONSTANTS: Tạo tên kênh chuẩn
    const channelName = PUSHER_EVENTS.POST_CHANNEL(postId);
    const channel = pusherClient.subscribe(channelName);

    const handleNewComment = (data: IComment) => {
      setCommentList((prev) => {
        if (prev.some((c) => c._id === data._id)) return prev;
        return [...prev, data];
      });

      const isPostOwner = user?.id === postAuthorId;
      const isNotMyComment = user?.id !== data.authorId;

      if (isPostOwner && isNotMyComment) {
        toast.success(`💬 ${data.authorName} vừa bình luận!`);
      }

      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    // 👇 DÙNG CONSTANTS: Tên sự kiện chuẩn
    channel.bind(PUSHER_EVENTS.NEW_COMMENT, handleNewComment);

    return () => {
      channel.unbind(PUSHER_EVENTS.NEW_COMMENT, handleNewComment);
      pusherClient.unsubscribe(channelName);
    };
  }, [postId, user?.id, postAuthorId]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!inputContent.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputContent }),
      });

      if (!res.ok) throw new Error("Lỗi gửi bình luận");
      setInputContent(""); 
    } catch (error) {
      toast.error("Gửi thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
      {/* Danh sách Comment */}
      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {commentList.map((comment) => (
          <div key={comment._id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <img src={comment.authorImage} alt={comment.authorName} className="w-8 h-8 rounded-full border border-gray-200 object-cover shrink-0" />
            <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-2xl rounded-tl-none">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{comment.authorName}</span>
                <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
              </div>
              <p className="text-[14px] leading-snug">{comment.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Form Nhập */}
      {user ? (
        <form onSubmit={handleComment} className="flex gap-2 items-center relative">
          <img src={user.imageUrl} className="w-8 h-8 rounded-full object-cover border border-gray-200" alt="Me" />
          <input 
            type="text" 
            placeholder="Bình luận gì đó..." 
            className="flex-1 bg-gray-100 dark:bg-gray-900 border-none rounded-full py-2.5 px-4 focus:ring-1 focus:ring-black dark:focus:ring-white transition-all outline-none text-sm"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!inputContent.trim() || isLoading}
            className="absolute right-2 p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-full disabled:opacity-50 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-400 text-sm">Đăng nhập để bình luận</p>
      )}
    </div>
  );
}