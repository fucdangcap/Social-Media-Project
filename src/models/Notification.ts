import mongoose, { Schema, models, model } from "mongoose";

const NotificationSchema = new Schema({
  recipientId: { 
    type: String, 
    required: true,
    index: true 
  },
  actorId: { type: String, required: true },     
  actorName: { type: String, required: true },   
  actorImage: { type: String },
  
  type: { type: String, required: true },        
  postId: { type: String, required: true },      
  message: { type: String },                     
  isRead: { type: Boolean, default: false },     
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: -1 
  },
});


NotificationSchema.index({ recipientId: 1, createdAt: -1 });


const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;