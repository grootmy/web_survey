// src/app/components/WriteButton.tsx
"use client";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/features/auth/withAuthGuard";

export default function WriteButton() {
  const router = useRouter();
  const guard = useAuthGuard();
  return (
    <button
      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      onClick={guard(() => router.push("/posts/new"))}
    >
      글쓰기
    </button>
  );
}
