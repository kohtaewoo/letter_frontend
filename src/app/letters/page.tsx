"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

export default function LetterInbox() {
  const [letters, setLetters] = useState<
    { id: string; title: string; senderName: string; sentAt: string; content: string }[]
  >([]);
  const [selectedLetter, setSelectedLetter] = useState<{
    id: string;
    title: string;
    senderName: string;
    content: string;
    sentAt: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLetters = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다!");
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/letters/received`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLetters(response.data);
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error("❌ 편지 불러오기 실패:", axiosError);
        alert(axiosError.response?.data || "편지를 불러오는 데 실패했습니다.");
      }
    };
    fetchLetters();
  }, [router]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-[#FFE5EG] p-6">
      {/* 📥 왼쪽: 편지 목록 */}
      <div className="w-full md:w-1/3 h-[80vh] overflow-auto p-6 border-r border-pink-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-pink-600">📥 받은 편지함</h1>
          <button
            onClick={() => router.push("/mypage")}
            className="bg-pink-400 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-500 transition"
          >
            마이페이지 🏠
          </button>
        </div>

        {letters.length > 0 ? (
          <ul className="space-y-4">
            {letters.map((letter) => (
              <li
                key={letter.id}
                onClick={() => setSelectedLetter(letter)}
                className={`p-5 border rounded-lg cursor-pointer transition transform ${
                  selectedLetter?.id === letter.id
                    ? "bg-pink-300 text-white scale-105 shadow-lg"
                    : "bg-gray-100 hover:bg-pink-200 hover:scale-105"
                }`}
              >
                <p className="text-lg font-semibold">{letter.title}</p>
                <p className="text-sm text-gray-700">✉ 보낸 사람: {letter.senderName}</p>
                <p className="text-xs text-gray-600">📅 {new Date(letter.sentAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">📭 받은 편지가 없습니다.</p>
        )}
      </div>

      {/* 💌 오른쪽: 편지 내용 */}
      <div className="w-full md:w-2/3 h-[80vh] overflow-auto p-6">
        <h2 className="text-3xl font-extrabold text-pink-600 text-center">💌 편지 내용</h2>

        {selectedLetter ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-6 border rounded-xl bg-white shadow-lg"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-600">📅 {new Date(selectedLetter.sentAt).toLocaleString()}</p>
              <p className="text-lg font-semibold text-pink-500">✍ {selectedLetter.senderName} 님의 편지</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-md text-gray-900 leading-relaxed border border-pink-200">
              <ReactMarkdown>{selectedLetter.content}</ReactMarkdown>
            </div>
          </motion.div>
        ) : (
          <p className="text-gray-500 mt-6 text-center text-lg">📩 편지를 선택하면 내용이 여기에 표시됩니다.</p>
        )}
      </div>
    </div>
  );
}
