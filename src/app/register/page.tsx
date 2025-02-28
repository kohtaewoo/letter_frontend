"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, trimmedData);
      alert("회원가입 성공! 로그인해주세요.");
      router.push("/login");
    } catch (error) {
      alert("회원가입 실패! 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFE5EG] p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-sm w-full text-center border border-white/20"
      >
        <h1 className="text-3xl font-bold mb-6 text-black">📝 회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름"
            className="border-none bg-white/60 p-3 w-full rounded-xl focus:ring-2 focus:ring-pink-400 placeholder-gray-700"
            required
          />
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="아이디"
            className="border-none bg-white/60 p-3 w-full rounded-xl focus:ring-2 focus:ring-pink-400 placeholder-gray-700"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="border-none bg-white/60 p-3 w-full rounded-xl focus:ring-2 focus:ring-pink-400 placeholder-gray-700"
            required
          />
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold rounded-xl bg-pink-400 text-white shadow-md hover:bg-pink-500 transition disabled:opacity-50 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></span>
            ) : (
              "회원가입"
            )}
          </button>
        </form>
        <p className="text-center mt-6 text-black">
          이미 계정이 있으신가요?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => router.push("/login")}>
            로그인
          </span>
        </p>
      </motion.div>
    </div>
  );
}
