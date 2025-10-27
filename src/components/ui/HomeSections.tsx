import Link from "next/link";
import type { Post } from "@/types/post";
import { ThumbsUp, MessageCircle } from "lucide-react";

export function PopularSection({ items }: { items: Post[] }) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight">인기글</h2>
        {/* <Link href="/boards/manage-reviews" className="text-sm font-medium text-primary hover:underline">더보기</Link> */}
      </div>
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <ul>
          {items.map((p, i) => (
            <li key={p.id} className={`group hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-200 border-b border-default ${i === items.length - 1 ? 'border-b-0' : ''}`}>
              <Link className="flex items-start gap-4 p-4 sm:p-6" href={`/posts/${p.id}`}>
                <div className="text-2xl font-bold text-primary w-8 text-center">{i + 1}</div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-default group-hover:text-primary transition-colors duration-200 mb-1">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-muted line-clamp-2 mb-2">{p.excerpt}</p>}
                  <div className="flex items-center space-x-4 text-xs sm:text-sm text-muted">
                    <div className="flex items-center space-x-1">
                      {/* lucide-react Eye 아이콘 사용 */}
                      <span className="text-base flex items-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"/>
                        </svg>
                      </span>
                      <span>{(p.views ?? 0) > 1000 ? `${((p.views ?? 0) / 1000).toFixed(1)}k` : p.views ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="text-base" />
                      <span>{(p.likes ?? 0) > 1000 ? `${((p.likes ?? 0) / 1000).toFixed(1)}k` : p.likes ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="text-base" />
                      <span>{p.comments?.length ?? 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function RecentSection({ items }: { items: Post[] }) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-text-light dark:text-text-dark tracking-tight">최신글</h2>
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <ul>
          {items.map((p, i) => (
            <li key={p.id} className={`group hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-200 border-b border-default ${i === items.length - 1 ? 'border-b-0' : ''}`}>
              <Link className="flex items-center justify-between p-4 sm:p-6" href={`/posts/${p.id}`}>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-default group-hover:text-primary transition-colors duration-200 mb-1">{p.title}</h3>
                  <div className="flex items-center space-x-4 text-xs sm:text-sm text-muted">
                    <span>{p.author}</span>
                    <span>{new Date(p.createdAt).toLocaleString('ko-KR', { hour12: false, month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <div className="flex items-center space-x-1">
                      {/* lucide-react Eye 아이콘 사용 */}
                      <span className="text-base flex items-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7z"/>
                        </svg>
                      </span>
                      <span>{p.views ?? 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="text-base" />
                      <span>{p.likes ?? 0}</span>
                    </div>
                  </div>
                </div>
                {/* <div className="w-16 h-16 sm:w-20 sm:h-20 ml-4 flex-shrink-0 bg-center bg-cover rounded-lg bg-gray-200 dark:bg-gray-700">
                  썸네일 이미지 자리 - 임시로 그라데이션 배경
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-400 to-purple-600"></div>
                </div> */}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}


