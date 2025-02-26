"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

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
        alert("유저 정보를 불러오는데 실패했습니다.");
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

    // ✅ 입력값 검증 (공백 제거 및 검증)
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

    setIsSubmitting(true); // ✅ 요청 시작

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/letters/send`,
        { ...trimmedData, senderUsername: user.username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("편지를 성공적으로 보냈습니다!");
      router.push("/mypage");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || error.response?.data || "편지 보내기 실패!");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false); // ✅ 요청 종료 (성공/실패 무관)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FADADD] p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-pink-400">📩 편지 보내기</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            name="recipientUsername"
            value={formData.recipientUsername}
            onChange={handleChange}
            placeholder="받는 사람 아이디"
            className="border p-2 w-full rounded focus:ring-2 focus:ring-pink-400"
            required
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요..."
            className="border p-2 w-full h-32 rounded focus:ring-2 focus:ring-pink-400"
            required
          />
          <button
            type="submit"
            className="bg-pink-400 text-white p-2 w-full rounded hover:bg-pink-500 transition disabled:opacity-50"
            disabled={isSubmitting} // ✅ 요청 중 버튼 비활성화
          >
            {isSubmitting ? "보내는 중..." : "✉️ 보내기"}
          </button>
        </form>
      </div>
    </div>
  );
}
