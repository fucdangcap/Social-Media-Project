import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
    recipientId: { type: String, required: true }, // ID người nhận thông báo
    senderId: { type: String, required: true },  // ID người gửi thông báo
    senderName: { type: String, required: true }, // Tên người gửi
    senderImg: { type: String, require: true }, // Ảnh đại diện người gửi
    type: { type: String, enum: ["like", "comment", "follow"], required: true }, // Loại thông báo
    postId: { type: String }, // ID bài viết liên quan (nếu có)
    read: { type: Boolean, default: false }, // Trạng thái đã đọc
    },
    { timestamps: true } // Tự động thêm createdAt và updatedAt
);

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;
