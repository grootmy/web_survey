// src/components/CommentForm.tsx
"use client";
import { useAuth } from "@/features/auth/auth-context";
import { createComment } from "@/lib/api";
import { useRef, useState } from "react";

export default function CommentForm({
  postId,
  onSubmitted,
  parentId,
  placeholder,
  compact,
}: {
  postId: string;
  onSubmitted: (c: any) => void;
  parentId?: string;
  placeholder?: string;
  compact?: boolean;
}) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!user) return setErr("로그인이 필요합니다.");
    if (!body.trim()) return setErr("내용을 입력하세요.");
    setErr("");
    setPending(true);
    try {
      const c = await createComment({ post_id: postId, content: body, parent_comment_id: parentId });
      setBody("");
      requestAnimationFrame(() => {
        if (taRef.current) taRef.current.scrollTop = taRef.current.scrollHeight;
      });
      onSubmitted(c);
    } catch {
      setErr("등록 실패");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/50 flex items-center justify-center text-white text-xs font-bold bg-primary">
        {user?.nickname?.[0] || 'U'}
      </div>
      <div className="flex-1">
        <form onSubmit={submit}>
          <textarea
            ref={taRef}
            className="form-textarea w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary transition duration-200"
            placeholder={placeholder || (parentId ? "답글을 입력하세요..." : "댓글을 입력하세요...")}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              requestAnimationFrame(() => {
                const el = taRef.current;
                if (el) el.scrollTop = el.scrollHeight;
              });
            }}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submit();
            }}
            rows={4}
          />
          <div className="flex justify-end mt-4">
            <button 
              type="submit" 
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors duration-200" 
              disabled={pending}
            >
              {pending ? "등록 중..." : (parentId ? "답글 등록" : "댓글 등록")}
            </button>
          </div>
          {err && <span className="text-red-500 text-sm mt-2 block">{err}</span>}
        </form>
      </div>
    </div>
  );
}
