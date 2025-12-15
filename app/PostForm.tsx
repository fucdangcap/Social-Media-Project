"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import toast from "react-hot-toast";

export default function PostForm() {
    const [content, setContent] = useState(""); // Luu noi dung dang go
    const [isSubmitting, setIsSubmitting] = useState(false); // Trang thai dang gui
    const router = useRouter(); // Dung de lam moi trang sau khi dang bai thanh cong

    async function handleSubmit() {
        if(!content.trim()) return; //Neu rong thi khong lam gi

        setIsSubmitting(true); //Bat dau gui
        try {
            //Goi API de dang bai
            await fetch("/api/posts", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    author: "Truong Phuc", //hardcode ten User
                    content: content,
                }),
            });

            setContent(""); //Xoa o nhap
            router.refresh(); //Lam moi trang de hien thi bai moi

            //Toast thong bao thanh cong
            toast.success("Đăng bài thành công!", {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
        },
      });

        } catch (error) {
            console.error("Lỗi đăng bài:", error);
            //Toast thong bao loi
            toast.error("Đăng bài thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false); //Ket thuc gui
        }
    }

    return (
        <div className="flex gap-4 p-4 border-b border-gray-100">
            {/* Avatar User */}
            <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                    U
                </div>
            </div>

            {/* O nhap noi dung */}
            <div className="flex-1">
                <textarea
                    className="w-full text-black placeholder-gray-400 outline-none resize-none text-[15px]"
                    rows={2}
                    placeholder="Bạn đang nghĩ gì vậy?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    />
            
            {/* Nut Dang bai */}
            <div className="flex justify-end mt-2">
                <button
                    onClick={handleSubmit}
                    disabled={!content.trim() || isSubmitting}
                    // Thêm: shadow-md (bóng), hover:-translate-y-0.5 (nhích lên), duration-200 (mượt)
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-200 shadow-md ${
                    content.trim()
                    ? "bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    {isSubmitting ? "Đang đăng..." : "Đăng"}
                </button>
            </div>
            </div>
        </div>
    );

}