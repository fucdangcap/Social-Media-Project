import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/db';
import Follow from '@/models/Follow';
import { error } from 'console';

export async function POST(
    req: Request, 
    { params } : { params: Promise<{ userId : string }> }
) {
    try {
        const { userId: currentUserId } = await auth(); // Lấy userId của người đang đăng nhập
        const { userId: targetUserId } = await params; // Lấy userId của người muốn follow

        if (!currentUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Chưa đăng nhập
        }

        if (currentUserId === targetUserId) {
            return NextResponse.json({ error: "Không thể tự follow chính mình" }, { status: 400 });
        }

        await connectToDatabase();

        // Kiểm tra xem đã follow chưa
        const existingFollow = await Follow.findOne({ 
            followerId: currentUserId, 
            followingId: targetUserId 
        });

        if (existingFollow) {
            // Đã follow rồi -> bỏ follow
            await Follow.findByIdAndDelete(existingFollow._id);
            return NextResponse.json({ isFollowing: false });
    } else {
        // Chưa follow -> Tạo mới
        await Follow.create({
            followerId: currentUserId,
            followingId: targetUserId
        });
        return NextResponse.json({ isFollowing: true });
    }
    } catch (error) {
        console.error("Follow error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
