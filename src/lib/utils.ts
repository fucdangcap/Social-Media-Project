import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

// 1. Hàm gộp class CSS (Giúp code Tailwind gọn hơn, tránh xung đột)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 2. Hàm "Luộc chín" dữ liệu (Fix lỗi Next.js 15 với MongoDB)
// Biến ObjectId, Date thành chuỗi JSON sạch sẽ
export function serializeData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// 3. Hàm hiển thị thời gian (Ví dụ: "vừa xong", "5 phút trước")
export function formatTime(dateString: string | Date) {
  if (!dateString) return "";
  return formatDistanceToNow(new Date(dateString), {
    addSuffix: true,
    locale: vi,
  });
}