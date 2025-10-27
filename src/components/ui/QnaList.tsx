import Link from "next/link";
import type { Post } from "@/types/post";

export default function QnaList({ items }: { items: Post[] }) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-default overflow-hidden">
      <ul className="divide-y divide-default">
        {items.map((p) => (
          <li key={p.id} className="group hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-200">
            <Link className="block p-6" href={`/posts/${p.id}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-primary flex flex-col items-center justify-center w-12 text-center">
                  <span className="text-2xl font-bold">{(p as any).answersCount ?? 0}</span>
                  <span className="text-xs font-medium">답변</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-default group-hover:text-primary transition-colors duration-200 mb-2">
                    <span className="text-primary font-bold mr-2">[질문]</span>{p.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-muted">
                    <span>{p.author}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    <span>{new Date(p.createdAt).toLocaleString('ko-KR', { hour12: false })}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    <span>조회 {p.views ?? 0}</span>
                    <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                    <span>좋아요 {p.likes ?? 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


