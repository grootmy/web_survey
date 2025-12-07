// src/components/containers/PostDetailContainer.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import ImageGallery from "@/components/shared/ImageGallery";
import { useRouter } from "next/navigation";
import { formatKSTDateTime } from "@/lib/time";
import type { Post, Comment as UiComment } from "@/types/post";
import { useAuth } from "@/features/auth/auth-context";
import { updatePost, deletePost, fetchPostComments } from "@/lib/api";
import CommentForm from "@/components/shared/CommentForm";
import Comments from "@/components/shared/Comments";
import LockedCommentPlaceholder from "@/components/shared/LockedCommentPlaceholder";
import { usePostQuery, usePostMutations } from "@/features/posts/hooks";
import { ThumbsUp } from "lucide-react";

interface PostDetailContainerProps {
  post: Post;
}

export default function PostDetailContainer({ post: initialPost }: PostDetailContainerProps) {
  const { data } = usePostQuery(initialPost.id, initialPost);
  const [post, setPost] = useState(data ?? initialPost);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { like, view } = usePostMutations();
  const S3_BASE = process.env.NEXT_PUBLIC_S3_PUBLIC_BASE_URL;
  const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
  const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION;

  const buildPublicUrl = (key: string) => {
    if (S3_BASE) return `${S3_BASE.replace(/\/$/, "")}/${key}`;
    if (S3_BUCKET && AWS_REGION) return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    return key;
  };

  const [displayImages, setDisplayImages] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const raw = (post as any).imageUrls ?? (post as any).images ?? (post as any).image_urls ?? [];
      const list: string[] = Array.isArray(raw) ? raw : [];
      const resolved = list.map((item) => (
        /^https?:\/\//i.test(item) ? item : buildPublicUrl(item)
      ));
      if (alive) setDisplayImages(resolved);
    })();
    return () => {
      alive = false;
    };
  }, [post.id]);

  // 조회수 증가 (하이브리드: 즉시 UI 반영 + 백그라운드 서버 반영)
  useEffect(() => {
    // 1) 즉시 UI 반영 (낙관적 증가)
    setPost(prev => ({
      ...prev,
      views: (prev.views || 0) + 1,
    }));

    // 2) 서버 반영 (실패해도 UI는 유지)
    view.mutate(post.id, {
      // 실패 시 별도 롤백은 하지 않음 (간단한 UX 유지)
      onError: (err) => {
        console.warn('조회수 증가 실패(서버):', err);
      },
    });
  }, [post.id]);

  // 댓글 목록 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchPostComments(post.id);
        if (!mounted) return;
        setPost(prev => ({ ...prev, comments: list }));
      } catch (err) {
        console.warn('댓글 로드 실패:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [post.id]);

  // 좋아요 토글
  const handleLike = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const result = await like.mutateAsync(post.id);
      setPost(prev => ({
        ...prev,
        liked: result.liked,
        likes: result.likes,
      }));
    } catch (error) {
      console.error("좋아요 실패:", error);
      // 일시적으로 옵티미스틱 업데이트
      setPost(prev => ({
        ...prev,
        liked: !prev.liked,
        likes: (prev.likes || 0) + (prev.liked ? -1 : 1),
      }));
    }
  };

  // 게시글 수정
  const handleEdit = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedPost = await updatePost(
        post.id,
        {
          title: editTitle.trim(),
          content: editBody.trim(),
        }
        /* , user.token */
      );

      setPost(prev => ({
        ...prev,
        title: editTitle.trim(),
        body: editBody.trim(),
        excerpt: editBody.trim().substring(0, 100),
      }));
      setIsEditing(false);
      alert("게시글이 수정되었습니다.");
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      alert("게시글 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!confirm("정말로 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deletePost(post.id /* , user.token */);
      alert("게시글이 삭제되었습니다.");
      router.push("/");
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  // 작성자 또는 관리자 여부 판단 (백엔드에서 내려오는 author 식별자에 맞춰 보정 필요)
  // 권한 판별: 작성자 또는 관리자
  const canManage = !!user && (
    user.id === (post as any).authorId ||
    user.id === (post as any).user_id ||
    user.role === 'admin'
  );

  if (isEditing) {
    return (
      <article className="bg-card rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
        <div className="mb-4">
          <label className="block mb-2 font-semibold">제목</label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="form-input w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">내용</label>
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="form-textarea w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-md min-h-[200px]"
          />
        </div>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-transform duration-150 hover:-translate-y-0.5 hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting || !editTitle.trim() || !editBody.trim()}
            onClick={handleEdit}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
          <button
            className="inline-flex items-center justify-center rounded-lg border border-border-light bg-card px-4 py-2 text-sm font-medium text-text-light transition-colors duration-150 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-border-dark dark:text-text-dark"
            disabled={isSubmitting}
            onClick={() => {
              setIsEditing(false);
              setEditTitle(post.title);
              setEditBody(post.body);
            }}
          >
            취소
          </button>
        </div>
      </article>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl shadow-sm border border-border-light dark:border-border-dark">
        <div className="p-6 sm:p-8 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary font-bold text-sm">QnA</span>
            {canManage && (
              <div className="flex items-center gap-2">
                <button className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary-light" onClick={() => setIsEditing(true)}>수정</button>
                <span className="text-text-muted-light dark:text-text-muted-dark">·</span>
                <button className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-red-500" onClick={handleDelete}>삭제</button>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark tracking-tight mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-text-muted-light dark:text-text-muted-dark">
            <div className="flex items-center gap-2">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border-2 border-primary/50 flex items-center justify-center text-white text-xs font-bold bg-primary">
                {post.author[0]}
              </div>
              <span>{post.author}</span>
            </div>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
            <span className="hidden sm:inline">{formatKSTDateTime(post.createdAt)}</span>
            <span className="hidden sm:inline w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
            <div className="flex items-center space-x-1">
              {/* lucide-react의 Eye 아이콘 사용 */}
              <span className="text-base flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"/>
                </svg>
              </span>
              <span>{post.views ?? 0}</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer" onClick={handleLike}>
              <ThumbsUp className={`text-base ${post.liked ? 'text-primary' : ''}`} />
              <span>{post.likes ?? 0}</span>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8 prose prose-lg dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{post.body}</div>
        </div>
      </div>

      {/* 이미지 갤러리 */}
      {displayImages.length > 0 && (
        <div className="mt-8">
          <ImageGallery images={displayImages} />
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">댓글 {post.comments?.length ?? 0}개</h2>
        <div className="space-y-6">
          <Comments
            postId={post.id}
            comments={post.comments ?? []}
            onUpdated={(updated: UiComment) => setPost(prev => ({ ...prev, comments: (prev.comments ?? []).map(c => c.id === updated.id ? updated : c) }))}
            onDeleted={(id: string) => setPost(prev => ({ ...prev, comments: (prev.comments ?? []).map(c => c.id === id ? { ...c, status: 'deleted', body: '' } as UiComment : c) }))}
          />
        </div>
      </div>

      <div className="mt-12">
        {user ? (
          <div className="bg-card rounded-2xl p-6 border border-border-light dark:border-border-dark">
            <h3 className="font-bold text-lg mb-4">댓글 작성</h3>
            <CommentForm
              postId={post.id}
              onSubmitted={(c) => setPost((prev) => ({ ...prev, comments: [ ...(prev.comments ?? []), c ] }))}
            />
          </div>
        ) : (
          <LockedCommentPlaceholder variant="comment-form" />
        )}
      </div>
    </div>
  );
}
