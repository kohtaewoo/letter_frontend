"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-900 p-6">
      <h1 className="text-4xl font-bold mb-4 animate-fade-in">📩 Letter Service</h1>
      <p className="text-lg mb-6 text-center max-w-xl animate-fade-in">
        따뜻한 메시지를 주고받는 공간, Letter Service에서 사랑과 감동을 전달하세요.
      </p>
      <button
        onClick={() => router.push("/login")}
        className="px-6 py-3 bg-white text-pink-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition hover:scale-105 animate-bounce"
      >
        로그인하기
      </button>
    </div>
  );
}
