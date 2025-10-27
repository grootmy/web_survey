//src/app/ui/Feed.tsx
import PostCard from "./PostCard";
import type { Post } from "@/types/post";

interface FeedProps {
  posts: Post[];
  searchQuery?: string;
}

export default function Feed({ posts, searchQuery = "" }: FeedProps) {
  if (!posts?.length) return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
      <p className="text-text-muted-light dark:text-text-muted-dark">게시글이 없습니다.</p>
    </div>
  );
  return (
    <section className="grid grid-cols-1 gap-3">
      {posts.map(p => <PostCard key={p.id} post={p} searchQuery={searchQuery} />)}
    </section>
  );
}
