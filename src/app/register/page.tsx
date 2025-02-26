"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 입력값 검증 (공백 방지)
    const trimmedData = {
      name: formData.name.trim(),
      username: formData.username.trim(),
      password: formData.password.trim(),
    };

    if (!trimmedData.name || !trimmedData.username || !trimmedData.password) {
      alert("이름, 아이디, 비밀번호를 모두 입력해주세요!");
      return;
    }

    setIsSubmitting(true); // ✅ 요청 시작

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, trimmedData);
      alert("회원가입 성공! 로그인해주세요.");
      router.push("/login"); // ✅ 회원가입 후 로그인 페이지 이동
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.response?.data || "회원가입 실패!");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false); // ✅ 요청 끝 (성공/실패 모두 포함)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-pink-400">📝 회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-pink-400"
            required
          />
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
            disabled={isSubmitting} // ✅ 요청 중 버튼 비활성화
          >
            {isSubmitting ? "가입 중..." : "회원가입"}
          </button>
        </form>
        <p className="text-center mt-4">
          이미 계정이 있으신가요?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => router.push("/login")}>
            로그인
          </span>
        </p>
      </div>
    </div>
  );
}
