"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SendLetter() {
  const [formData, setFormData] = useState({ title: "", recipientUsername: "", content: "" });
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedData = {
      title: formData.title.trim(),
      recipientUsername: formData.recipientUsername.trim(),
      content: formData.content.trim(),
    };

    if (!trimmedData.title || !trimmedData.recipientUsername || !trimmedData.content) {
      alert("제목, 받는 사람 아이디, 내용을 모두 입력해주세요!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다!");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/letters/send`,
        { ...trimmedData, senderUsername: user.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("편지를 성공적으로 보냈습니다!");
      router.push("/mypage");
    } catch (error) {
      alert("편지 보내기 실패! 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFE5EG] p-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full text-center"
      >
        <h1 className="text-4xl font-bold text-pink-500 mb-6">📩 편지 보내기</h1>
        <p className="text-gray-600 mb-6">사랑과 감동을 담아 소중한 사람에게 편지를 보내보세요.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-gray-700 font-medium mb-1">제목</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="편지 제목을 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 text-gray-700"
              required
            />
          </div>
          <div className="text-left">
            <label className="block text-gray-700 font-medium mb-1">받는 사람</label>
            <input
              name="recipientUsername"
              value={formData.recipientUsername}
              onChange={handleChange}
              placeholder="받는 사람의 아이디를 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 text-gray-700"
              required
            />
          </div>
          <div className="text-left">
            <label className="block text-gray-700 font-medium mb-1">편지 내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="편지 내용을 입력하세요..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 text-gray-700 h-48 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold rounded-lg bg-pink-400 text-white shadow-md hover:bg-pink-500 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-spin h-6 w-6 border-t-2 border-white border-solid rounded-full"></span>
            ) : (
              "✉️ 보내기"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
