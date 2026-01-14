"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import NotificationHeart from "./NotificationsHeart";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold tracking-tighter hover:scale-105 transition-transform">
          ThreadsLite
        </Link>

        {/* MENU CHÍNH */}
        <SignedIn>
          <div className="flex items-center gap-1 md:gap-6 absolute left-1/2 -translate-x-1/2">
            
            {/* Home */}
            <Link href="/" className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </Link>

            {/* Search */}
            <Link href="/search" className="hidden md:block p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </Link>

            {/* ❤️ TRÁI TIM (Bấm vào sẽ sang trang /activity) */}
            <div className="flex items-center justify-center">
                <NotificationHeart />
            </div>

            {/* Profile */}
            <Link href={`/profile/${user?.id}`} className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </Link>

          </div>
        </SignedIn>

        {/* USER BUTTON */}
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>

          <SignedOut>
            <div className="flex gap-4">
                <Link href="/sign-in" className="font-semibold text-sm hover:underline">Đăng nhập</Link>
                <Link href="/sign-up" className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 dark:bg-white dark:text-black">
                    Đăng ký
                </Link>
            </div>
          </SignedOut>
        </div>

      </div>
    </nav>
  );
}