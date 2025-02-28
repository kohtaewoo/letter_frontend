"use client";
import axios from "axios";  // Axios를 임포트
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function MyPage() {
  const [user, setUser] = useState<{ username: string; name: string; createdAt: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다!");
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        alert("유저 정보를 불러오는 데 실패했습니다.");
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    // 로컬 스토리지에서 토큰 삭제
    localStorage.removeItem("token");

    // 바로 홈 페이지로 리다이렉션
    router.push("/"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFE5EG] p-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-black drop-shadow-lg tracking-wide mb-8"
      >
        🌸 Welcome, {user?.name || "Guest"}!
      </motion.h1>

      {user ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-lg text-center"
        >
          <p className="text-lg text-black font-semibold mb-6">
            ☀ 오늘도 당신의 하루가 <span className="font-bold">따뜻하고 행복</span>하길! 💖
          </p>

          <div className="flex flex-col space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/send-letter")}
              className="w-full py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-lg hover:shadow-xl transition"
            >
              ✉️ 편지 보내기
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/letters")}
              className="w-full py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg hover:shadow-xl transition"
            >
              📩 편지 보관함
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="w-full py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-lg hover:shadow-xl transition"
            >
              🚪 로그아웃
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <p className="text-black text-lg font-semibold animate-pulse">
          사용자 정보를 불러오는 중...
        </p>
      )}
    </div>
  );
}
