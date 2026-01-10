"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Định nghĩa kiểu dữ liệu User trả về
interface SearchUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  imageUrl: string;
  email: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm gọi API tìm kiếm
  useEffect(() => {
    // Kỹ thuật Debounce: Chỉ tìm sau khi ngừng gõ 500ms (để đỡ spam server)
    const delayDebounceFn = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/users/search?query=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="max-w-lg mx-auto min-h-screen border-x border-gray-100 dark:border-gray-800">
      
      {/* Ô tìm kiếm */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 sticky top-14 bg-white/80 dark:bg-gray-950/80 backdrop-blur z-10">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Tìm kiếm</h1>
        <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-3 top-3 text-gray-400">
             <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

            <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-900 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-1 focus:ring-gray-300 dark:text-white dark:focus:ring-gray-700 transition-all"
            />
        </div>
      </div>

      {/* Danh sách kết quả */}
      <div className="p-2">
        {isLoading && <p className="text-center text-gray-500 mt-4">Đang tìm...</p>}
        
        {!isLoading && results.length === 0 && query && (
             <p className="text-center text-gray-500 mt-4">Không tìm thấy ai.</p>
        )}

        <div className="flex flex-col gap-2">
          {results.map((user) => (
            <Link 
                key={user.id} 
                href={`/profile/${user.id}`}
                className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              <img 
                src={user.imageUrl} 
                alt={user.username || "User"} 
                className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
              <div>
                <h3 className="font-bold text-black dark:text-white text-sm">
                    {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-500 text-sm">
                    @{user.username || user.email?.split('@')[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}