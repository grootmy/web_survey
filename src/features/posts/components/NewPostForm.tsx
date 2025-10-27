// src/features/posts/components/NewPostForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { useLoginDialog } from "@/features/auth/components/LoginDialogProvider";
import { createPost, fetchCategories } from "@/lib/api";
import ImageUploader from "@/components/shared/ImageUploader";
import type { components } from "@/types/generated/openapi";
type CreatePostDto = components["schemas"]["CreatePostDto"];

type Seg = { value: string; label: string };

const SEGMENTS: Seg[] = [
  { value: "qna",               label: "Q&A" },
  { value: "product-reviews",   label: "제품리뷰" },
  { value: "manage-reviews",    label: "관리후기" },
  { value: "procedure-reviews", label: "시술후기" },
  { value: "research-news",     label: "연구 및 뉴스" },
  { value: "clinics",           label: "지역 병원/클리닉" },
];

const TITLE_MAX = 80;
const BODY_MIN  = 10;

export default function NewPostForm() {
  const { user } = useAuth();
  const { openLogin } = useLoginDialog();

  const [boardId, setBoardId] = useState<Seg["value"]>("qna");
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");
  const [tagText, setTagText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) openLogin();
  }, [user, openLogin]);

  const titleCount = `${title.length}/${TITLE_MAX}`;
  const bodyOk = body.trim().length >= BODY_MIN;

  const onAddTag = (raw: string) => {
    const t = raw.trim().replace(/^#/, "");
    if (!t) return;
    if (tags.includes(t)) return;
    setTags(prev => [...prev, t]);
    setTagText("");
  };

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

  const disabled = useMemo(() => {
    if (!user) return true;
    if (!title.trim() || title.length > TITLE_MAX) return true;
    if (!bodyOk) return true;
    return false;
  }, [user, title, bodyOk]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled || !user) return;
    setSubmitting(true);
    setErr("");

    try {
      const isUuidV4 = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
      // 보드 슬러그를 타입/카테고리로 변환
      const selectedSlug = boardId;
      const typeBySlug: Record<string, any> = {
        // 기본적으로 타입은 목록 필터 보조용. QnA/제품/병원은 category_id 우선
        qna: undefined,
        'product-reviews': undefined,
        'hospital-reviews': 'hospital',
        clinics: 'hospital',
      };
      const slugToEnvKey: Record<string, string> = {
        'manage-reviews': 'NEXT_PUBLIC_CATEGORY_ID_MANAGE_REVIEWS',
        'procedure-reviews': 'NEXT_PUBLIC_CATEGORY_ID_PROCEDURE_REVIEWS',
        'research-news': 'NEXT_PUBLIC_CATEGORY_ID_RESEARCH_NEWS',
        'product-reviews': 'NEXT_PUBLIC_CATEGORY_ID_PRODUCT_REVIEWS',
        'hospital-reviews': 'NEXT_PUBLIC_CATEGORY_ID_HOSPITAL_REVIEWS',
        clinics: 'NEXT_PUBLIC_CATEGORY_ID_HOSPITAL_REVIEWS',
        qna: 'NEXT_PUBLIC_CATEGORY_ID_QNA',
      };
      const nameBySlug: Record<string, string> = {
        'manage-reviews': '관리후기',
        'procedure-reviews': '시술후기',
        'research-news': '연구 및 뉴스',
        'product-reviews': '제품리뷰',
        'hospital-reviews': '병원후기',
        clinics: '병원후기',
        qna: 'Q&A',
      };

      let resolvedCategoryId: string | undefined = undefined;
      if (isUuidV4(selectedSlug)) {
        resolvedCategoryId = selectedSlug;
      } else if (slugToEnvKey[selectedSlug]) {
        const envKey = slugToEnvKey[selectedSlug];
        const fromEnv = envKey ? (process.env as any)[envKey] as string | undefined : undefined;
        if (fromEnv && isUuidV4(fromEnv)) {
          resolvedCategoryId = fromEnv;
        } else if (nameBySlug[selectedSlug]) {
          // 카테고리 목록에서 이름으로 ID 탐색 (폴백)
          const categories = await fetchCategories();
          const target = categories.find(c => (c?.name ?? '').trim() === nameBySlug[selectedSlug]);
          if (target?.category_id && isUuidV4(target.category_id)) {
            resolvedCategoryId = target.category_id;
          }
        }
      }

      const postType = typeBySlug[selectedSlug];

      const payload: CreatePostDto = {
        title: title.trim(),
        content: body.trim(),
        category_id: resolvedCategoryId,
        ...(postType ? { type: postType } : {}),
        tags: tags.length > 0 ? tags : [],
        image_urls: images.length > 0 ? images : undefined,
        is_anonymous: false,
      };
      const saved = await createPost(payload /* , user.token */);

      // 성공 시 상세 페이지로 이동
      window.location.href = `/posts/${saved.id}`; //홈은 "/"
    } catch (e: any) {
      setErr(e.message ?? "게시글 등록에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">새 글 쓰기</h2>
        <p className="text-text-muted-light dark:text-text-muted-dark">탈모 치료 경험과 정보를 함께 나눠요.</p>
      </div>

      {err && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-3">게시판</label>
          <div className="flex flex-wrap gap-2">
            {SEGMENTS.map(s => (
              <button 
                key={s.value} 
                type="button" 
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  boardId === s.value 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark text-text-light dark:text-text-dark hover:border-primary'
                }`}
                onClick={() => setBoardId(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">제목</label>
          <div className="relative">
            <input 
              className="form-input w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary transition duration-200 pr-16" 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              maxLength={TITLE_MAX} 
              placeholder="예) 미녹시딜 3개월차 변화 공유합니다" 
              autoFocus 
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted-light dark:text-text-muted-dark">
              {titleCount}
            </span>
          </div>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">간결하고 핵심이 보이게 작성해 주세요.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">내용</label>
          <textarea 
            className="form-textarea w-full bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark rounded-lg focus:ring-primary focus:border-primary transition duration-200 min-h-48" 
            value={body} 
            onChange={e=>setBody(e.target.value)} 
            placeholder="내용을 입력하세요 (사진/수치/기간이 있으면 좋아요)" 
          />
          <p className={`text-sm mt-1 ${bodyOk ? 'text-text-muted-light dark:text-text-muted-dark' : 'text-red-500'}`}>
            최소 {BODY_MIN}자 이상 작성해 주세요.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">태그</label>
          <div className="flex flex-wrap gap-2 p-3 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark min-h-12">
            {tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                #{t}
                <button 
                  type="button" 
                  aria-label={`${t} 제거`} 
                  onClick={() => removeTag(t)}
                  className="text-primary/60 hover:text-primary ml-1 text-base font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            <input 
              className="flex-1 min-w-32 bg-transparent border-none outline-none text-text-light dark:text-text-dark placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
              value={tagText} 
              onChange={e=>setTagText(e.target.value)} 
              placeholder="피나스테리드, 미녹시딜…"
              onKeyDown={e=>{ 
                if(['Enter',' ', ','].includes(e.key)){ 
                  e.preventDefault(); 
                  onAddTag(tagText);
                } 
                if(e.key==='Backspace' && !tagText && tags.length){ 
                  removeTag(tags[tags.length-1]); 
                } 
              }} 
            />
          </div>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">스페이스/엔터/쉼표로 태그를 추가할 수 있어요.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-2">이미지 첨부</label>
          <ImageUploader
            images={images}
            onImagesChange={setImages}
            maxImages={10}
          />
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">게시글에 관련된 이미지를 첨부해 보세요.</p>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button 
            type="button" 
            className="px-6 py-2 border border-border-light dark:border-border-dark rounded-lg text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors" 
            onClick={() => (window.location.href = "/")} 
            disabled={submitting}
          >
            취소
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors" 
            disabled={disabled || submitting}
          >
            {submitting? '등록 중…' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
