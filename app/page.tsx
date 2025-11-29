import Post from "./Post";

export default function Home() {
  return (
    <div className="min-h-screen bg-black-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white-800">Wassup</h1>
      
      {/* Khu vực chứa bài đăng */}
      <div className="max-w-lg mx-auto space-y-6">
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  );
}