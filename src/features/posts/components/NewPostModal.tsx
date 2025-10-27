//src/features/posts/components/NewPostModal.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { createPost } from "@/lib/api";
import type { components } from "@/types/generated/openapi";
type CreatePostDto = components["schemas"]["CreatePostDto"];
import { useLoginDialog } from "@/features/auth/components/LoginDialogProvider";
import { useAuth } from "@/features/auth/auth-context";
import { useRouter } from "next/navigation";

export default function NewPostModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [boardId, setBoardId] = useState<string>("qna"); // 기본 보드
  const [tags, setTags] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCancel = (e: Event) => { e.preventDefault(); onClose(); };
    el.addEventListener("cancel", onCancel);
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    return () => el.removeEventListener("cancel", onCancel);
  }, [open, onClose]);
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setErr("로그인이 필요합니다.");
    if (!title.trim()) return setErr("제목을 입력하세요.");
    setErr("");

    try {
      const payload: CreatePostDto = {
        title,
        content: body,
        category_id: boardId,
        tags: tags.split(" ").filter(Boolean),
        is_anonymous: false,
      };
      const saved = await createPost(payload);
      // 입력값 초기화
      setTitle("");
      setBody("");
      setTags("");
      setErr("");
      onClose();
      router.push(`/posts/${saved.id}`); // 새로고침 없이 상세로 이동
    } catch (e) {
      setErr("저장 중 오류가 발생했어요.");
    }
  };

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-modal="true"
      aria-labelledby="newPostTitle"
      onClick={(e) => {
        // 배경(바깥)을 클릭했을 때만 닫기
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 id="newPostTitle">새 글 쓰기</h2>
        {err && <p style={{ color: "var(--danger)" }}>{err}</p>}

        <form onSubmit={submit}>
          <div className="row">
            <input
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="row">
            <select
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="qna">Q&A</option>
              <option value="product-reviews">제품리뷰</option>
              <option value="manage-reviews">관리후기</option>
              <option value="procedure-reviews">시술후기</option>
              <option value="research-news">연구 및 뉴스</option>
              <option value="clinics">지역 병원/클리닉</option>
            </select>
          </div>

          <div className="row">
            <textarea
              placeholder="내용을 입력하세요"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="row">
            <input
              placeholder="#태그 를 공백으로 구분해 입력 (예: 피나스테리드 부작용)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="row justify-end gap-2">
            <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-light bg-card-light px-4 py-2 text-sm font-medium text-text-light transition-colors duration-200 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-border-dark dark:bg-card-dark dark:text-text-dark" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" >
              등록
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}