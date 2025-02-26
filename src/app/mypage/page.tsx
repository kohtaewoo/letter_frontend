"use client";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

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
          headers: { Authorization: `Bearer ${token}` }, // ✅ Authorization 헤더 추가
        });
        setUser(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("❌ 유저 정보 불러오기 실패:", error);
          alert(error.response?.data?.message || error.response?.data || "유저 정보를 불러오는 데 실패했습니다.");
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }

        localStorage.removeItem("token"); // ✅ 잘못된 토큰 제거
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    localStorage.removeItem("token"); // ✅ 먼저 토큰 삭제 (네트워크 오류 대비)

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("로그아웃 되었습니다!");
      router.push("/");
    } catch (error: unknown) {
      console.error("❌ 로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FADADD] p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-pink-400">👤 마이페이지</h1>
        {user ? (
          <>
            <p className="text-lg font-semibold text-gray-800">{user.name}님, 환영합니다! 🎉</p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push("/send-letter")}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
              >
                ✉️ 편지 보내기
              </button>
              <button
                onClick={() => router.push("/letters")}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
              >
                📩 편지 보관함
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-400 text-white p-2 rounded hover:bg-gray-500 transition"
              >
                로그아웃
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">유저 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}
