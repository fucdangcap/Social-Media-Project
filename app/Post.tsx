interface PostProps {
  content: string;
  author: string;
}

export default function Post({ content, author }: PostProps) {
  return (
    // Container chính: Dạng Flex (ngang), có đường kẻ mờ bên dưới (border-b)
    <div className="flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
      
      {/* CỘT TRÁI: Avatar */}
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
          {author[0]}
        </div>
      </div>

      {/* CỘT PHẢI: Nội dung */}
      <div className="flex-1">
        {/* Header: Tên + Thời gian */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-base text-black">{author}</h3>
          <span className="text-gray-400 text-sm">2h</span>
        </div>

        {/* Nội dung bài viết */}
        <p className="text-gray-900 text-[15px] leading-snug mb-3">
          {content}
        </p>

        {/* Thanh hành động (Action Bar): Like, Comment, Repost, Share */}
        <div className="flex gap-6">
          {/* Nút Like */}
          <button className="group flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          {/* Nút Comment */}
          <button className="text-gray-500 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
            </svg>
          </button>

          {/* Nút Repost */}
          <button className="text-gray-500 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}