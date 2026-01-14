"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { pusherClient } from "@/lib/pusher";

interface Comment {
  _id?: string;
  content: string;
  authorName: string;
  authorImage: string;
  createdAt: string;
  authorId?: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  postAuthorId: string;
}

export default function CommentSection({ postId, comments, postAuthorId }: CommentSectionProps) {
  const { user } = useUser();
  const [commentList, setCommentList] = useState<Comment[]>(comments);
  const [inputContent, setInputContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- 1. XỬ LÝ REAL-TIME ---
  useEffect(() => {
    const channelName = `post_${postId}`;
    const channel = pusherClient.subscribe(channelName);

    const handleNewComment = (data: Comment) => {
      setCommentList((prev) => {
        // Chặn trùng lặp tuyệt đối: Nếu ID đã có trong list rồi thì thôi
        if (prev.some((c) => c._id === data._id)) return prev;
        return [...prev, data];
      });

      // Nếu người khác comment thì báo, mình comment thì thôi (đỡ phiền)
      const isPostOwner = user?.id === postAuthorId;
      const isNotMyComment = user?.id !== data.authorId;

      if (isPostOwner && isNotMyComment) {
        toast.success(`💬 ${data.authorName} vừa bình luận bài viết của bạn!`);
      }

      // Tự động trượt xuống
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

    channel.bind("new-comment", handleNewComment);

    return () => {
      channel.unbind("new-comment", handleNewComment);
      pusherClient.unsubscribe(channelName);
    };
  }, [postId, user?.id]);

  // --- 2. GỬI COMMENT (Đã sửa logic) ---
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

      // 👇 SỬA Ở ĐÂY: Chỉ xóa ô nhập liệu, KHÔNG tự thêm vào list nữa
      // Hãy để Pusher (ở useEffect trên) tự lo việc hiển thị
      setInputContent("");
      
    } catch (error) {
      toast.error("Gửi thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  // --- 3. XÓA COMMENT ---
  async function handleDelete(commentId: string) {
    const isConfirmed = window.confirm("Bạn có chắc muốn xóa?");
    if (!isConfirmed) return;

    // Xóa trên giao diện trước cho mượt
    const backupList = [...commentList];
    setCommentList((prev) => prev.filter((c) => c._id !== commentId));

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lỗi xóa");
      }
      toast.success("Đã xóa");
    } catch (error) {
      // Nếu lỗi thì hoàn tác lại
      setCommentList(backupList);
      // Ép kiểu error để lấy message
      const msg = (error as any).message || "Có lỗi xảy ra";
      toast.error("Không xóa được: " + msg);
    }
  }

  return (
    <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
      {/* Form Nhập */}
      <form onSubmit={handleComment} className="flex gap-3 mb-6">
        {user && (
          <img src={user.imageUrl} className="w-8 h-8 rounded-full border border-gray-200" alt="Avt" />
        )}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 dark:text-white"
            disabled={isLoading}
          />
          {inputContent.trim() && (
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

      {/* Danh Sách */}
      <div className="space-y-4 max-h-100x overflow-y-auto pr-2 custom-scrollbar">
        {commentList.map((comment, index) => {
          if (!comment) return null;

          // Check quyền: Chính chủ comment HOẶC Chủ bài viết
          const isOwner = user?.id === comment.authorId;
          const isPostAuthor = user?.id === postAuthorId;
          const canDelete = isOwner || isPostAuthor;

          return (
            <div key={comment._id || index} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2">
              <img
                src={comment.authorImage}
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-gray-200 object-cover"
              />
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-2xl rounded-tl-none inline-block">
                  <span className="font-bold text-sm block text-black dark:text-white">
                    {comment.authorName}
                  </span>
                  <p className="text-sm text-gray-800 dark:text-gray-300 wrap-break-words">
                    {comment.content}
                  </p>
                </div>
                
                {/* Nút Xóa */}
                {canDelete && (
                  <div className="ml-2 mt-1">
                     <button
                        onClick={() => handleDelete(comment._id!)}
                        className="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline font-medium"
                      >
                        Xóa
                      </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}