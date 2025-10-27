import Link from "next/link";
import type { Post } from "@/types/post";

export default function ProductGrid({ items }: { items: Post[] }) {
  if (!items?.length) return (
    <div className="bg-card rounded-2xl shadow-sm border border-default p-6">
      <p className="text-muted">게시글이 없습니다.</p>
    </div>
  );

  const getThumb = (p: Post) => {
    const src = p.images?.[0];
    return src || 
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=680&auto=format&fit=crop";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((p) => (
        <Link key={p.id} href={`/posts/${p.id}`} className="group block bg-card rounded-2xl shadow-sm border border-default overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="aspect-w-16 aspect-h-9">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={p.title} src={getThumb(p)} className="object-cover w-full h-full" />
          </div>
          <div className="p-5">
            <h3 className="text-lg font-semibold text-default group-hover:text-primary transition-colors duration-200 mb-2 truncate">{p.title}</h3>
            {p.excerpt && (
              <p className="text-sm text-muted mb-3 line-clamp-2">{p.excerpt}</p>
            )}
            <div className="flex items-center text-xs text-muted">
              <span>{p.author}</span>
              <span className="mx-1.5 w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              <span>{new Date(p.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}


