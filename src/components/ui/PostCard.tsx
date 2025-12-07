"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Post } from "@/types/post";
import { useAuthGuard } from "@/features/auth/withAuthGuard";
import { formatKSTDateTime } from "@/lib/time";
import { usePostMutations } from "@/features/posts/hooks";

/** 검색어를 <mark>로 하이라이트 */
function highlight(text: string, q: string) {
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "ig");
  const parts = text.split(re);
  return parts.map((chunk, i) =>
    re.test(chunk) ? <mark key={i}>{chunk}</mark> : <span key={i}>{chunk}</span>
  );
}

interface PostCardProps {
  post: Post;
  searchQuery?: string;
}

export default function PostCard({ post, searchQuery = "" }: PostCardProps) {
  const [liked, setLiked] = useState(!!post.liked);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const guard = useAuthGuard();
  const router = useRouter();
  const { like } = usePostMutations();

  const handleToggleLike = async () => {
    try {
      const result = await like.mutateAsync(post.id);
      setLiked(result.liked);
      setLikes(result.likes);
    } catch (error) {
      console.error("좋아요 실패:", error);
      // 옵티미스틱 업데이트 (실패 시 토글)
      setLiked(!liked);
      setLikes(likes + (liked ? -1 : 1));
    }
  };

  return (
    <article
      className="group hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-200 rounded-xl border border-default bg-card"
      onClick={() => router.push(`/posts/${post.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="inline-grid place-items-center w-5 h-5 rounded bg-primary text-white text-xs font-bold">
            {post.author?.[0] ?? "U"}
          </span>
          <span className="font-medium">{post.author}</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <time dateTime={post.createdAt}>{formatKSTDateTime(post.createdAt)}</time>
        </div>

        <Link className="block mt-2 text-lg font-semibold text-default group-hover:text-primary transition-colors" href={`/posts/${post.id}`} onClick={(e) => e.stopPropagation()}>
          {highlight(post.title ?? "", searchQuery)}
        </Link>

        {post.excerpt && (
          <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
            {highlight(post.excerpt, searchQuery)}
          </p>
        )}

        <div className="mt-3 flex items-center gap-3 text-sm text-muted">
          <button
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border ${liked ? 'border-primary text-primary' : 'border-border-light dark:border-border-dark'}`}
            aria-pressed={liked}
            onClick={(e) => {
              e.stopPropagation();
              return guard(handleToggleLike)();
            }}
            title={liked ? "좋아요 취소" : "좋아요"}
          >
            ❤ {likes}
          </button>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          <span>조회 {post.views ?? 0}</span>
          {post.tags?.length ? (
            <>
              <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="post-chip">#{t}</span>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
