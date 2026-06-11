# ThreadsLite

Một nền tảng mạng xã hội hiện đại, được xây dựng với Next.js 16, cung cấp các tính năng like, comment, follow, và thông báo real-time.

## ✨ Công nghệ sử dụng

### Frontend
- **Next.js 16** - React framework hiệu suất cao
- **React 19** - Thư viện UI components
- **TypeScript** - Type safety cho codebase
- **Tailwind CSS 4** - Styling utility-first
- **React Hot Toast** - Notification system
- **Pusher JS** - Real-time updates

### Backend
- **Next.js API Routes** - API endpoints
- **Clerk** - Authentication & user management
- **Pusher** - Real-time features (notifications, live updates)

### Database
- **MongoDB** - NoSQL database
- **Mongoose 9** - ODM for MongoDB

### Development Tools
- **ESLint** - Code linting
- **TypeScript 5** - Type safety

## 🚀 Cách chạy dự án

### Yêu cầu
- Node.js 18+
- npm hoặc yarn
- MongoDB Atlas hoặc MongoDB local
- Tài khoản Clerk (authentication)
- Tài khoản Pusher (real-time features)

### Cài đặt
1. Clone repo về máy:
   ```bash
   git clone <repo-url>
   cd mini-social
   ```

2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Tạo file `.env.local` và điền các biến môi trường cần thiết:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret

   # Real-time (Pusher)
   NEXT_PUBLIC_PUSHER_APP_ID=your_pusher_app_id
   NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
   NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
   PUSHER_SECRET=your_pusher_secret
   ```

4. Chạy development server:
   ```bash
   npm run dev
   ```

5. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt

### Scripts khác
- `npm run build` - Build production
- `npm start` - Start production server
- `npm run lint` - Chạy ESLint

## 🌐 Live Demo
Xem demo tại: [ThreadsLite - Vercel](https://social-media-project-theta-ten.vercel.app/)

## 📁 Cấu trúc dự án
```
src/
├── app/              # Next.js app directory (pages & layouts)
├── api/              # API routes
├── components/       # React components
├── lib/              # Utilities (database, cache, rate limiting)
├── models/           # Mongoose schemas
├── actions/          # Server actions
└── types/            # TypeScript type definitions
```

## 📝 Tính năng chính
- 👤 Quản lý hồ sơ người dùng
- 📱 Tạo & xem posts
- ❤️ Like & comment posts
- 👥 Follow/Unfollow người dùng
- 🔔 Thông báo real-time
- 🔍 Tìm kiếm người dùng
- ⚡ Rate limiting & cache optimization

---

**Phiên bản:** 0.1.0 | **License:** MIT
