// src/components/PostDetail.tsx
"use client";
import LikeButton from "./LikeButton";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import LockedCommentPlaceholder from "./LockedCommentPlaceholder";
import ImageGallery from "./ImageGallery";
import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useAuth } from "@/features/auth/auth-context";

export default function PostDetail({ post }: { post: any }) {
  const { user } = useAuth();
  const [data, setData] = useState(post);

  return (
    <article className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6 sm:p-8">
      {/* 헤더 (작성자/시간) */}
      <div className="flex items-center gap-4 text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-primary/50 flex items-center justify-center text-white text-xs font-bold bg-primary">
            {data.author?.[0] || 'U'}
          </div>
          <span className="font-semibold text-text-light dark:text-text-dark">{data.author}</span>
        </div>
        <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
        <time dateTime={data.createdAt} className="text-sm">
          {new Date(data.createdAt).toLocaleString("ko-KR", { hour12: false })}
        </time>
      </div>

      {/* 제목/메타(왼쪽) + 태그(오른쪽) 한 줄 */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark tracking-tight mb-2">{data.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-text-muted-light dark:text-text-muted-dark">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="text-base" />
              <span>{data.likes ?? 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              {/* Lucide-react의 Eye 아이콘 사용 */}
              <span className="text-base flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"/>
                </svg>
              </span>
              <span>{data.views ?? 0}</span>
            </div>
          </div>
        </div>

        {Array.isArray(data.tags) && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((t: string) => (
              <span key={t} className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-full text-gray-600 dark:text-gray-400">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <hr className="border-0 border-t border-border-light dark:border-border-dark my-6" />

      {/* 본문 */}
      <div className="whitespace-pre-wrap leading-relaxed text-base prose prose-lg dark:prose-invert max-w-none mb-6">
        {data.body}
      </div>

      {/* 이미지 갤러리 */}
      {data.imageUrls && data.imageUrls.length > 0 && (
        <ImageGallery images={data.imageUrls} />
      )}

      <hr className="border-0 border-t border-border-light dark:border-border-dark my-6" />

      {/* 액션 */}
      <div className="flex gap-2 mb-8">
        <LikeButton
          postId={data.id}
          initialCount={data.likes ?? 0}
          onChange={(cnt) => setData((d: any) => ({ ...d, likes: cnt }))}
        />
      </div>

      {/* 댓글 섹션 */}
      <section className="mt-8">
        {user ? (
          <>
            <h3 className="text-lg font-bold mb-4">댓글 작성</h3>
            <div className="mb-8">
              <CommentForm
                postId={data.id}
                onSubmitted={(c) =>
                  setData((d: any) => ({ ...d, comments: [...(d.comments ?? []), c] }))
                }
              />
            </div>
          </>
        ) : (
          <div className="mb-8">
            <LockedCommentPlaceholder variant="comment-form" />
          </div>
        )}
        <h3 className="text-lg font-bold mb-4">댓글 {data.comments?.length ?? 0}개</h3>
        <Comments postId={data.id} comments={data.comments ?? []} />
      </section>
    </article>
  );
}
