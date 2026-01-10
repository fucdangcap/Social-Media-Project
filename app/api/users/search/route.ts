import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET (req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    // Nếu không có query, trả về mảng rỗng
    if (!query) {
        return NextResponse.json([]);
    }

    try {
        // Tìm kiếm người dùng dựa trên query
        const client = await clerkClient();
        const users = await client.users.getUserList({
            query: query,
            limit: 10, // Giới hạn số lượng kết quả trả về
        });

        // Loc dữ liệu để chỉ trả về những thông tin cần thiết
        const results = users.data.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0]?.emailAddress || null,
        }));

        return NextResponse.json(results);
    } catch (error) {
        console.error("Lỗi khi tìm kiếm người dùng:", error);
        return NextResponse.json([], { status: 500 });
    }
}