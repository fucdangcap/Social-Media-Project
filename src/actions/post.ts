"use server";

import connectToDatabase from "@/lib/db";
import PostModel from "@/models/Post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createPost(content: string) {
  if (!content || !content.trim()) throw new Error("Nội dung trống");

  const user = await currentUser();
  if (!user) throw new Error("Chưa đăng nhập");

  await connectToDatabase();

  await PostModel.create({
    content: content,
    authorId: user.id,
    authorName: user.firstName || "Anonymous",
    authorImage: user.imageUrl,
    createdAt: new Date(),
    likes: [],
    comments: [],
  });

  revalidatePath("/");
  return { success: true };
}