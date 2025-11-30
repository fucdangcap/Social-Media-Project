import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Vui lòng định nghĩa biến MONGODB_URI trong file .env.local"
  );
}

// Vì Next.js chạy serverless, chúng ta cần cache lại kết nối
// để tránh việc tạo quá nhiều kết nối mỗi khi f5 trang web
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("🔥 ĐÃ KẾT NỐI THÀNH CÔNG VỚI MONGODB! 🔥"); // Dòng này sẽ hiện ra
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;