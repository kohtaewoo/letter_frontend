"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function LetterInbox() {
  const [letters, setLetters] = useState<{ id: string; title: string; senderName: string; sentAt: string }[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<{
    title: string;
    senderName: string;
    content: string;
    sentAt: string;
  } | null>(null); // ✅ 선택된 편지 상태 추가
  const [isClient, setIsClient] = useState(false); // ✅ Hydration Error 방지
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // ✅ 클라이언트에서 실행되도록 설정

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

  // ✅ 편지 클릭 시 상세 내용을 불러오는 함수
  const fetchLetterDetail = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/letters/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedLetter(response.data);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error("❌ 편지 내용 불러오기 실패:", axiosError);
      alert(axiosError.response?.data || "편지 내용을 불러오는 데 실패했습니다.");
    }
  };

  if (!isClient) return null; // ✅ Hydration Error 방지

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FADADD] p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-pink-400">📥 편지 보관함</h1>
        
        {/* ✅ 편지 목록 */}
        {letters.length > 0 ? (
          <ul className="space-y-3">
            {letters.map((letter) => (
              <li
                key={letter.id}
                onClick={() => fetchLetterDetail(letter.id)} // ✅ 클릭하면 상세 내용 불러옴
                className="p-3 border rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
              >
                <p className="font-semibold">{letter.title}</p>
                <p className="text-sm text-gray-600">보낸 사람: {letter.senderName}</p>
                <p className="text-xs text-gray-500">{new Date(letter.sentAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">받은 편지가 없습니다.</p>
        )}

        {/* ✅ 선택된 편지 상세 보기 */}
        {selectedLetter && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold text-pink-500">{selectedLetter.title}</h2>
            <p className="text-sm text-gray-600">보낸 사람: {selectedLetter.senderName}</p>
            <p className="text-xs text-gray-500">{new Date(selectedLetter.sentAt).toLocaleString()}</p>
            <hr className="my-2" />
            <p className="text-gray-800">{selectedLetter.content}</p>
            <button
              onClick={() => setSelectedLetter(null)} // ✅ 닫기 기능 추가
              className="mt-4 w-full bg-pink-400 text-white p-2 rounded hover:bg-pink-500 transition"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
