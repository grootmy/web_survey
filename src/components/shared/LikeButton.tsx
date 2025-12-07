// src/components/LikeButton.tsx
"use client";
import { useAuth } from "@/features/auth/auth-context";
import { useState } from "react";
import { toggleLike } from "@/lib/api";

export default function LikeButton({
  postId, initialCount, onChange,
}: { postId: string; initialCount: number; onChange?: (n:number)=>void }) {
  const { user } = useAuth();
  const [count, setCount] = useState(initialCount ?? 0);
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    setBusy(true);
    try {
      const { likes } = await toggleLike(postId);
      setCount(likes);
      onChange?.(likes);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className="inline-flex items-center justify-center rounded-lg border border-border-light bg-card-light px-3 py-1.5 text-sm font-medium text-text-light transition-colors duration-150 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
      onClick={onClick}
      disabled={busy}
    >
      👍 좋아요 {count}
    </button>
  );
}
