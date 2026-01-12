"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ user, isOpen, onClose }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Lấy dữ liệu cũ điền sẵn vào ô
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [bio, setBio] = useState(user.unsafeMetadata?.bio || "");

  if (!isOpen) return null; // Nếu chưa bấm mở thì ẩn đi

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, bio }),
      });

      if (!res.ok) throw new Error("Lỗi cập nhật");

      toast.success("Cập nhật hồ sơ thành công!");
      router.refresh(); // F5 lại trang để thấy tên mới
      onClose(); // Đóng bảng
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        
        <h2 className="text-xl font-bold mb-4 dark:text-white">Chỉnh sửa hồ sơ</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Họ</label>
                <input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tên</label>
                <input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tiểu sử</label>
            <textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
                placeholder="Viết gì đó về bạn..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
            >
                Hủy
            </button>
            <button 
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black"
            >
                {isLoading ? "Đang lưu..." : "Xong"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}