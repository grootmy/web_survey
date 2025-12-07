import Link from "next/link";
import { fetchNotices } from "@/lib/api";

export default async function NoticesPage() {
  const items = await fetchNotices();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-0">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wide text-primary font-semibold">
          Notice
        </p>
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
          공지사항
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark mt-2">
          서비스 업데이트, 이벤트, 커뮤니티 운영 정책 등 주요 소식을 확인하세요.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((notice) => (
          <Link
            key={notice.slug}
            href={`/notices/${notice.slug}`}
            className="block rounded-2xl border border-default bg-card hover:-translate-y-0.5 transition-transform duration-200 shadow-sm hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {notice.category === "event"
                    ? "이벤트"
                    : notice.category === "update"
                      ? "안내"
                      : "공지"}
                </p>
                <time className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {new Date(notice.createdAt).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2">
                {notice.title}
              </h2>
              <p className="text-text-muted-light dark:text-text-muted-dark line-clamp-2">
                {notice.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


