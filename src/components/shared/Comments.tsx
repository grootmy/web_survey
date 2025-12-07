// src/components/Comments.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { deleteComment, updateComment } from "@/lib/api";
import type { Comment as UiComment } from "@/types/post";
import CommentForm from "./CommentForm";
import LockedCommentPlaceholder from "./LockedCommentPlaceholder";

type Props = {
  postId: string;
  comments: UiComment[];
  onUpdated?: (updated: UiComment) => void;
  onDeleted?: (id: string) => void;
};

export default function Comments({ postId, comments, onUpdated, onDeleted }: Props) {
  const { user } = useAuth();

  // 로컬 목록 상태 (부모 업데이트 없이도 UI 반영)
  const [items, setItems] = useState<UiComment[]>(comments);
  useEffect(() => {
    setItems(comments);
  }, [comments]);

  // 댓글 펼침/말줄임 상태
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [overflow, setOverflow] = useState<Record<string, boolean>>({});

  // 수정 상태
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [editText, setEditText] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({});

  // 각 댓글 본문 DOM 레퍼런스
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  // 한 개 댓글의 줄수/오버플로우 측정
  const measureOne = (id: string) => {
    const el = refs.current[id];
    if (!el) return;

    const lh = parseFloat(getComputedStyle(el).lineHeight || "0") || 20;
    const threeLines = lh * 3;

    const hadClamp = el.classList.contains('line-clamp-3');
    if (hadClamp) el.classList.remove('line-clamp-3');

    const contentH = el.scrollHeight;

    if (hadClamp && !expanded[id]) el.classList.add('line-clamp-3');

    const willOverflow = contentH > threeLines + 1;
    setOverflow((prev) =>
      prev[id] === willOverflow ? prev : { ...prev, [id]: willOverflow }
    );
  };

  const measureAll = () => {
    for (const c of items) measureOne(c.id);
  };

  // ref 콜백: 연결 즉시 한 번 측정
  const setBodyRef =
    (id: string) =>
    (el: HTMLDivElement | null): void => {
      refs.current[id] = el;
      if (el) requestAnimationFrame(() => measureOne(id));
    };

  // ✅ 부모가 넘겨준 comments가 바뀔 때마다 전체 다시 측정
  useEffect(() => {
    const raf = requestAnimationFrame(measureAll);
    const onResize = () => requestAnimationFrame(measureAll);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const canManage = (c: UiComment): boolean => {
    if (!user) return false;
    return c.ownerId === user.id || user.role === "admin";
  };

  const beginEdit = (c: UiComment) => {
    setEditing((m) => ({ ...m, [c.id]: true }));
    setEditText((m) => ({ ...m, [c.id]: c.body }));
  };

  const cancelEdit = (id: string) => {
    setEditing((m) => ({ ...m, [id]: false }));
  };

  const saveEdit = async (c: UiComment) => {
    if (c.status === 'deleted') return;
    const text = (editText[c.id] ?? "").trim();
    if (!text) return;
    setPending((m) => ({ ...m, [c.id]: true }));
    try {
      const updated = await updateComment(c.id, { content: text });
      setItems((arr) => arr.map((x) => (x.id === c.id ? updated : x)));
      // 렌더 중 외부 setState 방지: 비동기 완료 후 안전 시점에 콜백 호출
      setTimeout(() => onUpdated?.(updated), 0);
      setEditing((m) => ({ ...m, [c.id]: false }));
    } catch (e) {
      console.error("댓글 수정 실패:", e);
      alert("댓글 수정에 실패했습니다.");
    } finally {
      setPending((m) => ({ ...m, [c.id]: false }));
    }
  };

  const removeOne = async (c: UiComment) => {
    if (!confirm("이 댓글을 삭제하시겠습니까?")) return;
    setPending((m) => ({ ...m, [c.id]: true }));
    try {
      await deleteComment(c.id);
      // 소프트 삭제: 목록에서 제거하지 않고 표시만 변경
      setItems((arr) => arr.map((x) => x.id === c.id ? { ...x, status: 'deleted', body: '' } as UiComment : x));
      setTimeout(() => onDeleted?.(c.id), 0);
    } catch (e) {
      console.error("댓글 삭제 실패:", e);
      alert("댓글 삭제에 실패했습니다.");
    } finally {
      setPending((m) => ({ ...m, [c.id]: false }));
    }
  };

  const addReplyTo = (parentId: string, reply: UiComment) => {
    let updated: UiComment | undefined;
    setItems((arr) => arr.map((x) => {
      if (x.id !== parentId) return x;
      const replies = Array.isArray(x.replies) ? x.replies.slice() : [];
      replies.push(reply);
      const next = { ...x, replies } as UiComment;
      updated = next;
      return next;
    }));
    setReplyOpen((m) => ({ ...m, [parentId]: false }));
    if (updated) onUpdated?.(updated);
  };

  if (!items.length)
    return <p style={{ color: "var(--muted)" }}>아직 댓글이 없어요.</p>;

  const renderOne = (c: UiComment, key: string | number, isReply?: boolean) => {
    const isOpen = !!expanded[c.id];
    const isOverflow = !!overflow[c.id];
    const isEditing = !!editing[c.id];
    const isPending = !!pending[c.id];
    const isDeleted = c.status === 'deleted';
    const displayBody = isDeleted ? '삭제된 댓글입니다.' : c.body;

    if (isReply) {
      // 대댓글 스타일
      return (
        <li key={key}>
          <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark">
            <div className="flex items-start gap-4">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center text-white text-xs font-bold bg-primary">
                {c.userId?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{c.userId}</p>
                  {!isDeleted && canManage(c) && (
                    <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                      {!isEditing ? (
                        <>
                          <button className="hover:text-primary" onClick={() => beginEdit(c)}>수정</button>
                          {' · '}
                          <button className="hover:text-red-500" onClick={() => removeOne(c)} disabled={isPending}>삭제</button>
                        </>
                      ) : (
                        <>
                          <button className="hover:text-primary" onClick={() => saveEdit(c)} disabled={isPending}>저장</button>
                          {' · '}
                          <button className="hover:text-red-500" onClick={() => cancelEdit(c.id)} disabled={isPending}>취소</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-2">
                  {new Date(c.createdAt).toLocaleString("ko-KR", { hour12: false })}
                </p>
                {!user ? (
                  <LockedCommentPlaceholder variant="comment-content" />
                ) : !isEditing ? (
                  <div
                    ref={setBodyRef(c.id)}
                    className={`whitespace-pre-wrap ${
                      !isOpen && isOverflow ? 'line-clamp-3' : ''
                    }`}
                  >
                    {displayBody}
                  </div>
                ) : (
                  <textarea
                    className="form-textarea w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                    value={editText[c.id] ?? c.body}
                    onChange={(e) => setEditText((m) => ({ ...m, [c.id]: e.target.value }))}
                    rows={3}
                  />
                )}
                {isOverflow && !isEditing && user && (
                  <button
                    className="mt-2 text-sm font-semibold text-primary hover:underline"
                    onClick={() => setExpanded((m) => ({ ...m, [c.id]: !isOpen }))}
                  >
                    {isOpen ? "간략히 보기" : "자세히 보기"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </li>
      );
    }

    // 일반 댓글 스타일
    return (
      <li key={key}>
        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-6 border border-border-light dark:border-border-dark">
          <div className="flex items-start gap-4">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center text-white text-xs font-bold bg-primary">
              {c.userId?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{c.userId}</p>
                {!isDeleted && canManage(c) && (
                  <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {!isEditing ? (
                      <>
                        <button className="hover:text-primary" onClick={() => beginEdit(c)}>수정</button>
                        {' · '}
                        <button className="hover:text-red-500" onClick={() => removeOne(c)} disabled={isPending}>삭제</button>
                      </>
                    ) : (
                      <>
                        <button className="hover:text-primary" onClick={() => saveEdit(c)} disabled={isPending}>저장</button>
                        {' · '}
                        <button className="hover:text-red-500" onClick={() => cancelEdit(c.id)} disabled={isPending}>취소</button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-2">
                {new Date(c.createdAt).toLocaleString("ko-KR", { hour12: false })}
              </p>
              {!user ? (
                <LockedCommentPlaceholder variant="comment-content" />
              ) : !isEditing ? (
                <div
                  ref={setBodyRef(c.id)}
                  className={`whitespace-pre-wrap ${
                    !isOpen && isOverflow ? 'line-clamp-3' : ''
                  }`}
                >
                  {displayBody}
                </div>
              ) : (
                <textarea
                  className="form-textarea w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary transition duration-200"
                  value={editText[c.id] ?? c.body}
                  onChange={(e) => setEditText((m) => ({ ...m, [c.id]: e.target.value }))}
                  rows={3}
                />
              )}
              {isOverflow && !isEditing && user && (
                <button
                  className="mt-2 text-sm font-semibold text-primary hover:underline"
                  onClick={() => setExpanded((m) => ({ ...m, [c.id]: !isOpen }))}
                >
                  {isOpen ? "간략히 보기" : "자세히 보기"}
                </button>
              )}
              {!isDeleted && user && (
                <button
                  className="mt-2 text-sm font-semibold text-primary hover:underline"
                  onClick={() => setReplyOpen((m) => ({ ...m, [c.id]: !replyOpen[c.id] }))}
                >
                  대댓글 달기
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 대댓글 작성 폼 */}
        {replyOpen[c.id] && !isDeleted && (
          <div className="ml-8 sm:ml-12 mt-4">
            <CommentForm
              postId={postId}
              parentId={c.id}
              placeholder="답글을 입력하세요"
              compact
              onSubmitted={(reply) => addReplyTo(c.id, reply)}
            />
          </div>
        )}

        {/* 대댓글 렌더링 */}
        {Array.isArray(c.replies) && c.replies.length > 0 && (
          <div className="ml-8 sm:ml-12 border-l-2 border-border-light dark:border-border-dark pl-6 sm:pl-8 mt-4">
            <ul className="space-y-6">
              {c.replies.map((r, idx) => renderOne(r, `r-${c.id}-${idx}`, true))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-6">
      {items.map((c, index) => renderOne(c, c.id || `c-${index}`))}
    </div>
  );
}
