// src/components/shared/LockedCommentPlaceholder.tsx
"use client";
import { useLoginDialog } from "@/features/auth/components/LoginDialogProvider";
import { Lock } from "lucide-react";

type Props = {
  variant?: "comment-content" | "comment-form";
};

export default function LockedCommentPlaceholder({ variant = "comment-content" }: Props) {
  const { openLogin } = useLoginDialog();

  if (variant === "comment-form") {
    return (
      <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark">
        <h3 className="font-bold text-lg mb-4">댓글 작성</h3>
        <div className="p-6 bg-background-light dark:bg-background-dark rounded-lg flex flex-col items-center justify-center text-center">
          <Lock className="w-12 h-12 text-muted mb-2" />
          <p className="text-muted font-semibold">댓글을 작성하려면 로그인이 필요합니다.</p>
          <button 
            onClick={openLogin}
            className="mt-4 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors duration-200"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  // variant === "comment-content"
  return (
    <div className="mt-2 p-4 bg-background-light dark:bg-background-dark rounded-lg flex items-center justify-center text-center">
      <div className="flex flex-col items-center gap-2 text-muted">
        <Lock className="w-10 h-10" />
        <p className="text-sm font-medium">로그인 후 댓글을 확인해보세요.</p>
      </div>
    </div>
  );
}
