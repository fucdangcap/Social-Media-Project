"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    // nav: thẻ bao ngoài
    // sticky top-0: Dính chặt lên đỉnh màn hình khi cuộn
    // backdrop-blur-md: Hiệu ứng kính mờ (nội dung lướt qua bên dưới sẽ mờ đi)
    // z-50: Đảm bảo nó luôn nằm ĐÈ LÊN trên các bài viết
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* LOGO: Bấm vào thì về trang chủ */}
        <Link 
          href="/" 
          className="font-bold text-xl tracking-tighter hover:opacity-80 transition"
        >
          ThreadsLite
        </Link>

        {/* PHẦN BÊN PHẢI: Nếu đã đăng nhập thì hiện Avatar, chưa thì hiện nút Login */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/"/>
          ) : (
            <Link 
              href="/sign-in"
              className="text-sm font-semibold bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              Đăng nhập
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}