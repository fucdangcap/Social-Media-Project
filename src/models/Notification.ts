import mongoose, { Schema, models, model } from "mongoose";

const NotificationSchema = new Schema({
  recipientId: { type: String, required: true },
  actorId: { type: String, required: true },     
  actorName: { type: String, required: true },   
  actorImage: { type: String },
  
  type: { type: String, required: true },        
  postId: { type: String, required: true },      
  message: { type: String },                     
  isRead: { type: Boolean, default: false },     
  createdAt: { type: Date, default: Date.now },
});

// Kiểm tra xem model đã tồn tại chưa để tránh lỗi OverwriteModelError khi hot-reload
const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;