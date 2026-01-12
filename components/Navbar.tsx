"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

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

        {/* HOME & SEARCH & NOTIFICATIONS */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-6">
            
            {/* 1. Home */}
            <Link href="/" className={`p-3 rounded-lg transition ${isActive("/") ? "text-black dark:text-white" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={isActive("/") ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={isActive("/") ? 2 : 1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </Link>

            {/* 2. Search */}
            <Link href="/search" className={`p-3 rounded-lg transition ${isActive("/search") ? "text-black dark:text-white" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill={isActive("/search") ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={isActive("/search") ? 2 : 1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </Link>

            {/* 3. Notifications (Trái tim - Mới thêm) */}
            <Link href="/notifications" className={`p-3 rounded-lg transition ${isActive("/notifications") ? "text-red-500 fill-red-500" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" fill={isActive("/notifications") ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={isActive("/notifications") ? 2 : 1.5} stroke="currentColor" className={`w-7 h-7 ${isActive("/notifications") ? "text-red-600" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </Link>

        </div>

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