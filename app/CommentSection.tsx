"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Comment {
  _id: string;
  authorName: string;
  authorImage: string;
  content: string;
  replyTo?: string; // Người được trả lời
  createdAt: string;
}

export default function CommentSection({ postId, initialComments }: { postId: string, initialComments: Comment[] }) {
  const { user } = useUser();
  const router = useRouter();
  
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null); // Đang trả lời ai?
  const [isLoading, setIsLoading] = useState(false);

  //Ham xu ly khi cmt @
  const renderContentWithTags = (text: string) => {
    return text.split(" ").map((word, index) => {
        if (word.startsWith("@")) {
            return <span key={index} className="text-blue-500 font-semibold">{word} </span>;
            }  return word + " ";
        });
    };

    //Ham xu ly khi bam nut SUBMIT
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!content.trim()) return;
        setIsLoading(true);
        try {
          const res = await fetch('/api/post/${postId}/comment', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              content, 
              replyTo: replyTo }),
          });

          if (!res.ok) throw new Error("Lỗi khi gửi bình luận"); 
          const updatedPost = await res.json();

          // Cập nhật danh sách bình luận
          setComments(updatedPost.comments);
          
          // Reset form
          setContent("");
          setReplyTo(null);
          toast.success("Bình luận đã được gửi!");
          router.refresh();
        } catch (error) {
          toast.error((error as Error).message);
        } finally {
          setIsLoading(false);
        }
}
  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <h3 className="font-bold mb-4">Bình luận ({comments.length})</h3>

      {/* DANH SÁCH COMMENT */}
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <img src={comment.authorImage} alt={comment.authorName} className="w-8 h-8 rounded-full border border-gray-200" />

            <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-black dark:text-white">{comment.authorName}</span>
                <button 
                  onClick={() => {
                    setReplyTo(comment.authorName);
                    // Tự động thêm @Tên vào ô nhập
                    setContent(`@${comment.authorName} `);
                  }}
                  className="text-xs text-gray-400 hover:text-black dark:hover:text-white"
                >
                  Reply
                </button>
              </div>
              
              {/* Hiển thị dòng "Đang trả lời..." nếu có */}
              {comment.replyTo && (
                <p className="text-xs text-gray-400 mb-1">
                  Replying to <span className="text-blue-500">@{comment.replyTo}</span>
                </p>
              )}
              
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {renderContentWithTags(comment.content)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* FORM NHẬP BÌNH LUẬN */}
      {user ? (
        <form onSubmit={handleSubmit} className="relative">
          {replyTo && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg w-fit">
              <span>Đang trả lời <b className="text-black dark:text-white">{replyTo}</b></span>
              <button onClick={() => { setReplyTo(null); setContent(""); }} className="text-red-500 hover:font-bold">✕</button>
            </div>
          )}
          
          <div className="flex gap-3">
            <img src={user.imageUrl} className="w-8 h-8 rounded-full border" />
            <input 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={replyTo ? `Trả lời ${replyTo}...` : "Viết bình luận..."}
              // Chú ý đoạn dark:bg-gray-800 và dark:text-white
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 transition text-black dark:text-white dark:placeholder-gray-400"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!content.trim() || isLoading}
              className="text-blue-600 font-bold text-sm disabled:text-gray-300"
            >
              Gửi
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-400 text-sm">Đăng nhập để bình luận</p>
      )}
    </div>
  );
} 