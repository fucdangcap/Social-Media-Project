// Định nghĩa cấu trúc Comment
export interface IComment {
  _id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  createdAt: string; // Dùng string vì dữ liệu sẽ được serialize
}

// Định nghĩa cấu trúc Bài viết
export interface IPost {
  _id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  content: string;
  image?: string;
  likes: string[]; // Danh sách ID người like
  comments: IComment[];
  createdAt: string;
}

// Định nghĩa cấu trúc Thông báo
export interface INotification {
  _id: string;
  recipientId: string;
  actorId: string;
  actorName: string;
  actorImage: string;
  type: "like" | "comment";
  postId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}