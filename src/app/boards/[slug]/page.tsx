// app/boards/[slug]/page.tsx
import { notFound } from "next/navigation";
import Hero from "@/components/ui/Hero";
import PostCard from "@/components/ui/PostCard";
import QnaList from "@/components/ui/QnaList";
import ProductGrid from "@/components/ui/ProductGrid";
import { fetchPosts, fetchPostsByType, fetchPostsByCategoryName, fetchCategories, fetchPostsByCategory } from "@/lib/api";

type Props = { 
  params: Promise<{ slug: string }>; 
  searchParams: Promise<{ tag?: string }> 
};

const BOARD_LABEL: Record<string, string> = {
  // 기존 보드 유지 (라벨 변경)
  talk: "Q&A",
  treatment: "치료/약 정보",
  reviews: "관리후기/제품리뷰",
  clinics: "지역 병원/클리닉",
  // 새 디자인 카테고리
  qna: "Q&A",
  "product-reviews": "제품리뷰",
  "manage-reviews": "관리후기",
  "procedure-reviews": "시술후기",
  "research-news": "연구 및 뉴스",
  "hospital-reviews": "병원 후기",
};

export default async function BoardPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tag } = await searchParams;

  const boardTitle = BOARD_LABEL[slug];
  if (!boardTitle) return notFound();

  // Q&A → PostType.expert_qna, 제품리뷰 → product, 병원 후기 → hospital
  let posts;
  if (slug === 'qna') {
    // 카테고리 우선 → 타입 폴백
    const idFromEnv = process.env.NEXT_PUBLIC_CATEGORY_ID_QNA;
    const isUuidV4 = (v?: string) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
    if (isUuidV4(idFromEnv)) {
      const res = await fetchPostsByCategory(String(idFromEnv), 1, 20);
      posts = res.posts;
    } else {
      const categories = await fetchCategories();
      const target = categories.find(c => (c?.name ?? '').trim() === 'Q&A');
      if (target?.category_id && isUuidV4(target.category_id)) {
        const res = await fetchPostsByCategory(target.category_id, 1, 20);
        posts = res.posts;
      } else {
        const res = await fetchPostsByType('expert_qna', 1, 20);
        posts = res.posts;
      }
    }
  } else if (slug === 'product-reviews' || slug === 'product') {
    const idFromEnv = process.env.NEXT_PUBLIC_CATEGORY_ID_PRODUCT_REVIEWS;
    const isUuidV4 = (v?: string) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
    if (isUuidV4(idFromEnv)) {
      const res = await fetchPostsByCategory(String(idFromEnv), 1, 20);
      posts = res.posts;
    } else {
      const categories = await fetchCategories();
      const target = categories.find(c => (c?.name ?? '').trim() === '제품리뷰');
      if (target?.category_id && isUuidV4(target.category_id)) {
        const res = await fetchPostsByCategory(target.category_id, 1, 20);
        posts = res.posts;
      } 
      else 
      {
        const res = await fetchPostsByType('product', 1, 20);
        posts = res.posts;
      }
    }
  } else if (slug === 'hospital-reviews' || slug === 'clinics') {
    const res = await fetchPostsByType('hospital', 1, 20);
    posts = res.posts;
  } else if (slug === 'manage-reviews' || slug === 'procedure-reviews' || slug === 'research-news') {
    // 1차: 환경변수 기반 슬러그→카테고리ID 매핑 (가장 견고)
    const slugToEnvKey: Record<string, string> = {
      'manage-reviews': 'NEXT_PUBLIC_CATEGORY_ID_MANAGE_REVIEWS',
      'procedure-reviews': 'NEXT_PUBLIC_CATEGORY_ID_PROCEDURE_REVIEWS',
      'research-news': 'NEXT_PUBLIC_CATEGORY_ID_RESEARCH_NEWS',
    };
    const envKey = slugToEnvKey[slug];
    const idFromEnv = envKey ? process.env[envKey] : undefined;
    const isUuidV4 = (v?: string) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

    if (isUuidV4(idFromEnv)) {
      const res = await fetchPostsByCategory(String(idFromEnv), 1, 20);
      posts = res.posts;
    } else {
      // 2차: 카테고리 목록 조회 후 이름 매칭하여 ID 사용 (폴백)
      const nameBySlug: Record<string, string> = {
        'manage-reviews': '관리후기',
        'procedure-reviews': '시술후기',
        'research-news': '연구 및 뉴스',
      };
      const categories = await fetchCategories();
      const target = categories.find(c => (c?.name ?? '').trim() === nameBySlug[slug]);
      if (target?.category_id) {
        const res = await fetchPostsByCategory(target.category_id, 1, 20);
        posts = res.posts;
      } else {
        // 마지막 폴백: 이름 기반 API
        const res = await fetchPostsByCategoryName(nameBySlug[slug], 1, 20);
        posts = res.posts;
      }
    }
  } else {
    posts = await fetchPosts();
  }

  const items = tag
    ? posts.filter((p) => p.tags?.some((t: string) => t.includes(tag)))
    : posts;

  return (
    <>
      <Hero title={boardTitle} subtitle={tag ? `#${tag}` : undefined} />
      <div style={{ marginTop: 12 }}>
        {slug === 'qna' ? (
          items?.length ? <QnaList items={items as any} /> : (
            <div className="bg-card rounded-2xl shadow-sm border border-default p-6"><p className="text-muted">게시글이 없습니다.</p></div>
          )
        ) 
        // : slug === 'product-reviews' ? (
        //   items?.length ? (
        //     <ProductGrid items={items as any} />
        //   ) : (
        //     <div className="bg-card rounded-2xl shadow-sm border border-default p-6"><p className="text-muted">게시글이 없습니다.</p></div>
        //   )
        // ) 
        : (
          items?.length ? (
            <section className="feed">
              {items.map((p: any) => (
                <PostCard key={p.id} post={p} />
              ))}
            </section>
          ) : (
            <div className="bg-card rounded-2xl shadow-sm border border-default p-6"><p className="text-muted">게시글이 없습니다.</p></div>
          )
        )}
      </div>
    </>
  );
}
