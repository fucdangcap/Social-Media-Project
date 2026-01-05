"use client";

import { useRouter }  from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import Link from "next/link"; 

interface PostProps {
  id: string;
  content: string;
  authorName: string;
  authorImage: string;
  authorId: string;
  initialLikes: string[]; // Mang chua ID nguoi da like
  commentsCount: number; // Tong so binh luan
}

export default function Post({ id, authorName, authorImage, authorId, content, initialLikes = [], commentsCount = 0 }: PostProps) {
  const router = useRouter();
  const { user } = useUser();
  //State Quan ly giao dien
  const [likes, setLikes] = useState(initialLikes); // Lưu danh sách like
  const [isLiked, setIsLiked] = useState(false);//Trang thai tim do/trang 

  //Đồng bộ dữ liệu khi mới tải xong
  useEffect(() => {
    setLikes(initialLikes);
    setIsLiked(user ? initialLikes.includes(user.id) : false);
  }, [initialLikes, user]);

  const isOwner = user?.id === authorId;

  // ham xu ly khi bam nut DELETE
  async function handleDelete() {
    //Hoi lai cho chac
    if (!confirm("Bạn có chắc muốn xóa bài viết này không?")) return;
    try {
      //Gui yeu cau xoa bai viet den API
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      toast.success("Đã xóa bài viết!");
      router.refresh(); // Tai lai trang de cap nhat danh sach bai viet
    } catch (error) {
      toast.error("Xóa thất bại");
      console.error(error);
    }
  }

  // ham xu ly khi bam nut LIKE
  async function handleLike() {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thích bài viết");
      return;
    }
    //LƯU LẠI TRẠNG THÁI CŨ (Đề phòng lỗi thì quay xe)
    const previousLikes = [...likes];
    const previousIsLiked = isLiked;
    
    //CẬP NHẬT GIAO DIỆN NGAY LẬP TỨC (LẠC QUAN)
    if (isLiked) {
      // Nếu đang Like -> Bấm thành Unlike
      setLikes(likes.filter(userId => userId !== user.id)); // Bỏ ID mình ra
      setIsLiked(false);
    } else {
      // Nếu chưa Like -> Bấm thành Like
      setLikes([...likes, user.id]); // Thêm ID mình vào
      setIsLiked(true);
    }

    //GỌI API NGẦM
    try {
      const res = await fetch(`/api/posts/${id}/like`, { method: "POST" });
      
      if (!res.ok) {
        throw new Error("Lỗi Server");
      }

      // Thành công thì refresh ngầm để đồng bộ dữ liệu chuẩn
      router.refresh(); 

    } catch (error) {
      //NẾU LỖI THÌ HOÀN TÁC (ROLLBACK)
      console.error(error);
      setLikes(previousLikes);    // Trả lại số like cũ
      setIsLiked(previousIsLiked); // Trả lại màu tim cũ
      toast.error("Lỗi kết nối, không like được!");
    }
  }

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
      {/* Avatar bấm vào thì sang trang profile */}
      <Link href={`/profile/${authorId}`} className="flex-shrink-0">
        <img 
        src={authorImage} 
        alt={authorName} 
        className="w-10 h-10 rounded-full object-cover border border-gray-200 hover:opacity-80 transition-opacity"/>
      </Link>

      {/* CỘT PHẢI: Nội dung bài viết */}
      <div className="flex-1 group">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">

            <Link href={`/profile/${authorId}`} className="font-bold text-base text-black dark:text-white hover:underline">
              {authorName}
            </Link>

            <span className="text-gray-400 text-sm">Just now</span>
          </div>

          {/* CHỈ HIỆN NÚT XÓA NẾU LÀ CHÍNH CHỦ (isOwner) */}
          {isOwner && (
            <button 
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
              title="Xóa bài viết"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          )}
        </div>

        <Link href={`/posts/${id}`}>
          <p className="text-gray-900 dark:text-gray-100 text-[15px] leading-snug mb-3 whitespace-pre-wrap">
            {content}
          </p>
        </Link>
        {/* Action Bar */}
        <div className="flex gap-10 text-gray-500">
          {/* Nút Thích */}
          <button 
             onClick={handleLike}
             className={`flex items-center gap-1.5 transition-colors group/like ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
           >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill={isLiked ? "currentColor" : "none"} // Nếu like rồi thì tô màu (fill), chưa thì rỗng
                viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className={`w-5 h-5 ${isLiked ? 'scale-110' : ''} transition-transform`} // Hiệu ứng phóng to nhẹ khi like
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="text-sm">{likes.length > 0 ? likes.length : ''}</span>
           </button>

          {/* Nút Bình luận */}
          <Link href={`/posts/${id}`} className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
            {/* Hiển thị số lượng comment (chỉ hiện nếu > 0) */}
            {commentsCount > 0 && <span className="text-sm">{commentsCount}</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}