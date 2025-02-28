"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, formData);
      const token = response.data.token || response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert("로그인 성공!");
      router.push("/mypage");
    } catch (error) {
      alert("로그인 실패! 아이디 또는 비밀번호를 확인해주세요.");
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold mb-6 text-black">🔑 로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-t-2 border-white border-solid rounded-full"></span>
            ) : (
              "로그인"
            )}
          </button>
        </form>
        <p className="text-center mt-6 text-black">
          계정이 없으신가요?{" "}
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => router.push("/register")}>
            회원가입
          </span>
        </p>
      </motion.div>
    </div>
  );
}
