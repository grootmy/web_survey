// app/boards/[slug]/page.tsx
import { notFound } from "next/navigation";
import Hero from "@/components/ui/Hero";
import PostCard from "@/components/ui/PostCard";
import QnaList from "@/components/ui/QnaList";
import {
  fetchPosts,
  fetchPostsByType,
  fetchPostsByCategoryName,
  fetchCategories,
  fetchPostsByCategory,
} from "@/lib/api";
import type { BoardFetchStrategy } from "@/lib/board-config";
import { BOARD_LABEL, getBoardConfig } from "@/lib/board-config";
import { isUuidV4 } from "@/lib/uuid";
import type { Post } from "@/types/post";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tag?: string }>;
};

const PAGE = 1;
const LIMIT = 20;

export default async function BoardPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tag } = await searchParams;

  const resolvedBoard = getBoardConfig(slug);
  const boardTitle =
    BOARD_LABEL[slug] ?? (resolvedBoard ? BOARD_LABEL[resolvedBoard.slug] : undefined);
  if (!boardTitle) return notFound();

  const posts = await fetchPostsForBoard(resolvedBoard?.config);

  const items = tag
    ? posts.filter((p) => p.tags?.some((t: string) => t.includes(tag)))
    : posts;

  return (
    <>
      <Hero title={boardTitle} subtitle={tag ? `#${tag}` : undefined} />
      <div className="mt-3">
        {(resolvedBoard?.slug ?? slug) === 'qna' ? (
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

async function fetchPostsForBoard(config?: BoardFetchStrategy): Promise<Post[]> {
  if (!config) {
    return fetchPosts();
  }
  return fetchPostsByStrategy(config);
}

async function fetchPostsByStrategy(config: BoardFetchStrategy): Promise<Post[]> {
  const postsFromEnv = await fetchPostsFromEnv(config);
  if (postsFromEnv) return postsFromEnv;

  if (config.categoryName) {
    const postsFromCategory = await fetchPostsFromCategory(config);
    if (postsFromCategory) return postsFromCategory;
  }

  if (config.fallbackType) {
    const { posts } = await fetchPostsByType(config.fallbackType, PAGE, LIMIT);
    return posts;
  }

  return fetchPosts();
}

async function fetchPostsFromEnv(config: BoardFetchStrategy) {
  if (!config.categoryEnvKey) return undefined;
  const idFromEnv = process.env[config.categoryEnvKey];
  return fetchPostsByCategoryId(idFromEnv);
}

async function fetchPostsFromCategory(config: BoardFetchStrategy) {
  const categories = await fetchCategories();
  const target = categories.find(
    (c) => (c?.name ?? '').trim() === config.categoryName
  );
  const postsFromCategory = await fetchPostsByCategoryId(target?.category_id);
  if (postsFromCategory) return postsFromCategory;

  if (config.enableCategoryNameApiFallback && config.categoryName) {
    const { posts } = await fetchPostsByCategoryName(
      config.categoryName,
      PAGE,
      LIMIT
    );
    return posts;
  }

  return undefined;
}

async function fetchPostsByCategoryId(categoryId?: string | null) {
  if (!isUuidV4(categoryId)) return undefined;
  const { posts } = await fetchPostsByCategory(categoryId, PAGE, LIMIT);
  return posts;
}

