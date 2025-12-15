import mongoose, { Schema, model, models } from "mongoose";

// Định nghĩa cấu trúc của 1 bài viết
const PostSchema = new Schema({
  author: { 
    type: String, 
    required: true // Bắt buộc phải có tên
  },
  content: { 
    type: String, 
    required: true // Bắt buộc phải có nội dung
  },
  likes: {
    type: Number,
    default: 0 // Mặc định không có like
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Mặc định lấy thời gian hiện tại
  }
});

// Kiểm tra xem Model này đã tồn tại chưa (tránh lỗi khi hot-reload), nếu chưa thì tạo mới
const Post = models.Post || model("Post", PostSchema);

export default Post;