"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true); // ✅ 로그인 요청 중 로딩 표시
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, formData);

      // ✅ JWT 토큰 저장
      const token = response.data.token || response.data; // 백엔드 응답 형태에 따라 수정 필요
      localStorage.setItem("token", token);

      // ✅ 이후 요청에 JWT 자동 포함 (선택 사항)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert("로그인 성공!");
      router.push("/mypage");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ 로그인 실패:", error);
        alert(error.response?.data?.message || error.response?.data || "로그인 실패! 아이디 또는 비밀번호를 확인해주세요.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false); // ✅ 요청 완료 후 로딩 해제
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-pink-400">🔑 로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="아이디"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-pink-400"
            required
          />
          <button
            type="submit"
            className="bg-pink-400 text-white p-2 w-full rounded hover:bg-pink-500 transition disabled:opacity-50"
            disabled={loading} // ✅ 로그인 중 버튼 비활성화
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <p className="text-center mt-4">
          계정이 없으신가요?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => router.push("/register")}>
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
}
