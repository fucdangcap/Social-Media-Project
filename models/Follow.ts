import mongoose, { Schema, model, models, } from "mongoose";

const FollowSchema = new Schema(
    {
        followerId: { type: String, required: true }, 
        followingId: { type: String, required: true }, 
    },
    { timestamps: true }
);


FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = models.Follow || model("Follow", FollowSchema);

export default Follow;
