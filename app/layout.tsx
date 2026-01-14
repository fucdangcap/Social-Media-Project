import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast"; 
import Navbar from "../components/Navbar"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ThreadsLite",
  description: "Mạng xã hội siêu nhẹ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* Class body đã sửa để fix lỗi hiển thị Dark Mode */}
        <body className={`${inter.className} bg-white dark:bg-gray-950 text-black dark:text-white`}>
          
          {/* 1. Navbar nằm trên cùng */}
          <Navbar />
          
          {/* 2. Toaster (để hiện thông báo pop-up) - Đặt đâu cũng được, miễn là trong body */}
          <Toaster position="bottom-left" />

          {/* 3. Nội dung chính của trang web */}
          <main className="pt-20 max-w-2xl mx-auto min-h-screen">
            {children}
          </main>
          
        </body>
      </html>
    </ClerkProvider>
  );
}