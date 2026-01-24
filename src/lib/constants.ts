export const PUSHER_EVENTS = {
  // Tạo tên kênh động
  POST_CHANNEL: (id: string) => `post_${id}`,
  USER_CHANNEL: (id: string) => `user_${id}`,
  
  // Tên sự kiện cố định
  NEW_COMMENT: "new-comment",
  UPDATE_LIKES: "update-likes",
  NEW_NOTIFICATION: "new-notification",
} as const;