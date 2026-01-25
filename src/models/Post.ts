import { auth } from "@clerk/nextjs/server";
import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const PostSchema = new Schema({
  authorId: { 
    type: String, 
    required: true,
    index: true 
  },
  authorName: {
    type: String,
    required: true 
  },
  authorImage: {
    type: String,
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  likes: {
    type: [String], 
    default: [] 
  },
  comments: [ CommentSchema ],
  
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: -1
  }
});


PostSchema.index({ authorId: 1, createdAt: -1 });

const Post = models.Post || model("Post", PostSchema);

export default Post;