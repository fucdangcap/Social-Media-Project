import { auth } from "@clerk/nextjs/server";
import mongoose, { Schema, model, models } from "mongoose";

// Định nghĩa cấu trúc của 1 bài viết
const PostSchema = new Schema({
  authorId: { 
    type: String, 
    required: true // ID dinh danh
  },
  authorName: {
    type: String,
    required: true // Bắt buộc phải có tên
  },
  authorImage: {
    type: String,
    required: true // Link anh dai dien
  },
  content: { 
    type: String, 
    required: true // Bắt buộc phải có nội dung
  },
  likes: {
    type: [String], // Mảng chứa ID của những người đã like bài viết
    default: [] // Mặc định là mảng rỗng
  },
  comments: [
    {
      _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },

      authorId: String,
      authorName: String,
      authorImage: String,
      content: String,

      replyTo: { type: String, default: null }, // ID của bình luận cha nếu có
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { 
    type: Date, 
    default: Date.now // Mặc định lấy thời gian hiện tại
  }
});

// Kiểm tra xem Model này đã tồn tại chưa (tránh lỗi khi hot-reload), nếu chưa thì tạo mới
const Post = models.Post || model("Post", PostSchema);

export default Post;