"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns"; 
import { vi } from "date-fns/locale"; 

interface Notification {
  _id: string;
  actorName: string;
  actorImage: string;
  type: "like" | "comment";
  message: string;
  postId: string;
  createdAt: string;
}

export default function ActivityPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Lỗi tải thông báo");
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Đang tải hoạt động...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 px-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 px-2">Hoạt động</h1>

      <div className="flex flex-col gap-2">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
             Chưa có thông báo nào.
          </div>
        ) : (
          notifications.map((notif) => (
            <Link 
              key={notif._id} 
              href={`/posts/${notif.postId}`}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {/* Avatar người tương tác */}
              <div className="relative">
                <img 
                  src={notif.actorImage} 
                  alt={notif.actorName} 
                  className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                />
                {/* Icon nhỏ ở góc avatar để biết là like hay cmt */}
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white dark:border-black ${
                  notif.type === 'like' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {notif.type === 'like' ? (
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-white">
                       <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
                     </svg>
                  ) : (
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-white">
                        <path fillRule="evenodd" d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 0 0 1.075.676L10 15.082l5.925 2.844A.75.75 0 0 0 17 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 2Z" clipRule="evenodd" />
                     </svg>
                  )}
                </div>
              </div>

              {/* Nội dung */}
              <div className="flex-1 text-sm">
                <span className="font-bold text-black dark:text-white mr-1">
                  {notif.actorName}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {notif.message}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {/* Hiển thị thời gian (ví dụ: 5 phút trước) */}
                  {notif.createdAt && formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                </p>
              </div>

              {/* (Optional) Ảnh nhỏ của bài viết bên phải nếu có */}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}