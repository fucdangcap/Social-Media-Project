import mongoose, { Schema, model, models, } from "mongoose";

const FollowSchema = new Schema(
    {
        followerId: { type: String, required: true }, //Người theo dõi (là mình)
        followingId: { type: String, required: true }, //Người được theo dõi {là người khác}
    },
    { timestamps: true }
);

// Đảm bảo 1 người chỉ follow 1 người khác 1 lần
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = models.Follow || model("Follow", FollowSchema);

export default Follow;
