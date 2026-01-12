import connectToDatabase from "@/lib/db";
import NotificationModel from "@/models/Notification";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NotificationsPage() {
  // 1. Kiểm tra đăng nhập
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await connectToDatabase();

  // 2. Lấy 20 thông báo mới nhất của người này
  const notifications = await NotificationModel.find({ recipientId: userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // Hàm phụ trợ: Sinh ra nội dung thông báo dựa vào loại (type)
  const getNotificationContent = (type: string) => {
    switch (type) {
        case "like": return "đã thích bài viết của bạn.";
        case "comment": return "đã bình luận về bài viết của bạn.";
        case "follow": return "đã bắt đầu theo dõi bạn.";
        default: return "đã tương tác với bạn.";
    }
  };

  // Hàm phụ trợ: Bấm vào thông báo thì đi đâu?
  // - Follow -> Sang trang cá nhân người đó
  // - Like/Comment -> Sang bài viết
  const getHref = (n: any) => {
      if (n.type === "follow") return `/profile/${n.senderId}`;
      return `/posts/${n.postId}`;
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white dark:bg-gray-950 border-x border-gray-100 dark:border-gray-800">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 sticky top-14 bg-white/80 dark:bg-gray-950/80 backdrop-blur z-10">
        <h1 className="text-2xl font-bold dark:text-white">Thông báo</h1>
      </div>

      {/* Danh sách thông báo */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
                Chưa có thông báo nào.
            </div>
        ) : (
            notifications.map((n: any) => (
                <Link 
                    key={n._id} 
                    href={getHref(n)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                >
                    {/* Ảnh đại diện người gửi */}
                    <div className="relative">
                        <img 
                            src={n.senderImage} 
                            alt="Avatar" 
                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        {/* Icon nhỏ xíu ở góc để biết loại thông báo (Tim/Comment/User) */}
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
                            {n.type === "like" && <span className="text-red-500 text-xs">❤️</span>}
                            {n.type === "comment" && <span className="text-blue-500 text-xs">💬</span>}
                            {n.type === "follow" && <span className="text-purple-500 text-xs">👤</span>}
                        </div>
                    </div>

                    {/* Nội dung chữ */}
                    <div className="flex-1">
                        <p className="text-sm text-black dark:text-white">
                            <span className="font-bold">{n.senderName}</span>{" "}
                            <span className="text-gray-600 dark:text-gray-300">
                                {getNotificationContent(n.type)}
                            </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {/* Format ngày tháng đơn giản */}
                            {new Date(n.createdAt).toLocaleDateString("vi-VN")}
                        </p>
                    </div>

                    {/* Nếu là like/comment bài viết thì hiện nút mũi tên cho đẹp */}
                    {n.type !== "follow" && (
                         <div className="text-gray-400">
                            👉
                         </div>
                    )}
                </Link>
            ))
        )}
      </div>
    </div>
  );
}