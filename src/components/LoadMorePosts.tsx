"use client";

import { useState } from "react";
import Post from "./Post";
import { IPost } from "@/types";

interface Props {
  initialPosts: IPost[];
}

export default function LoadMorePosts({ initialPosts }: Props) {
  const [posts, setPosts] = useState<IPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadMore() {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${page + 1}&limit=20`);
      const data = await res.json();
      
      if (data.posts && data.posts.length > 0) {
        setPosts(prev => [...prev, ...data.posts]);
        setPage(prev => prev + 1);
        setHasMore(data.pagination?.hasMore || false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi load posts:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {posts.map((post) => (
        <Post 
          key={post._id}
          _id={post._id}
          createdAt={post.createdAt}
          content={post.content}
          authorName={post.authorName}
          authorImage={post.authorImage}
          authorId={post.authorId}
          initialLikes={post.likes || []}
          commentsCount={post.comments?.length || 0}
        />
      ))}

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400">Chưa có bài viết nào.</p>
          <p className="text-sm text-gray-500">Hãy là người đầu tiên!</p>
        </div>
      )}

      {hasMore && posts.length > 0 && (
        <div className="p-4 text-center border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full font-medium text-sm transition-all disabled:opacity-50"
          >
            {isLoading ? "Đang tải..." : "Xem thêm bài viết"}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="p-8 text-center text-gray-400 text-sm">
          🎉 Bạn đã xem hết rồi!
        </div>
      )}
    </>
  );
}
