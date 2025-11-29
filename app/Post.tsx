export default function Post() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
        <div>
          <p className="font-bold">Admin User</p>
          <p className="text-xs text-gray-500">Vừa xong</p>
        </div>
      </div>
      <p className="mb-3 text-gray-800">
        Hello World! Đây là bài viết đầu tiên trên mạng xã hội của tôi. 
        Code React + Tailwind CSS cũng thú vị đấy chứ! 😎
      </p>
      <div className="flex gap-4 border-t pt-3">
        <button className="text-gray-600 hover:text-blue-500 font-medium text-sm">
          ❤️ Thích
        </button>
        <button className="text-gray-600 hover:text-blue-500 font-medium text-sm">
          💬 Bình luận
        </button>
      </div>
    </div>
  );
}