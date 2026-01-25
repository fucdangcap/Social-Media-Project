import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Post from "@/models/Post";
import { currentUser } from "@clerk/nextjs/server";
import { isRateLimited } from "@/lib/rateLimit"; // ✅ Import rate limiter
import { cache } from "@/lib/cache"; // ✅ Import cache

// Hàm xử lý khi Frontend gửi yêu cầu GET (Lấy danh sách bài viết)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  // ✅ CACHE: Kiểm tra cache trước (cache 1 phút cho page 1)
  const cacheKey = `posts_page_${page}_limit_${limit}`;
  if (page === 1) { // Chỉ cache trang 1 (trang hot nhất)
    const cached = cache.get(cacheKey);
    if (cached) return NextResponse.json(cached);
  }
  
  await connectToDatabase();
  
  const skip = (page - 1) * limit;
  
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('authorId authorName authorImage content likes comments createdAt')
    .lean();
    
  const total = await Post.countDocuments();
  
  const response = {
    posts,
    pagination: {
      page,
      limit,
      total,
      hasMore: skip + posts.length < total
    }
  };
  
  // Lưu vào cache (60 giây)
  if (page === 1) {
    cache.set(cacheKey, response, 60);
  }
  
  return NextResponse.json(response);
}

// Hàm xử lý khi Frontend gửi yêu cầu POST (Đăng bài)
export async function POST(request: Request) {
  try {
    // 1. Kiểm tra người dùng đã đăng nhập chưa
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Bạn phải đăng nhập để đăng bài"},
        { status: 401 }
      );
    }
    
    // ✅ RATE LIMIT: Chống spam đăng bài (tối đa 10 bài/phút)
    if (isRateLimited(user.id, 10, 60 * 1000)) {
      return NextResponse.json(
        { error: "Đăng bài quá nhanh! Vui lòng chờ chút." },
        { status: 429 }
      );
    }
    
    const { content } = await request.json();
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Nội dung trống" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const newPost = await Post.create({
      content,
      authorId: user.id,
      authorName: user.firstName || "Người dùng",
      authorImage: user.imageUrl,
    });
    
    // ✅ CACHE: Xóa cache posts khi có bài mới
    cache.deletePattern('posts_page_*');
    
    return NextResponse.json({ message: "Đăng thành công!", post: newPost });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server: " + error }, { status: 500 });
  }
}
