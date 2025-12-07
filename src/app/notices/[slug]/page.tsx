import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchNotice } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function NoticeDetailPage({ params }: Props) {
  const { slug } = await params;
  const notice = await fetchNotice(slug);
  if (!notice) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-0">
      <div className="mb-6">
        <Link
          href="/notices"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
        >
          ← 공지 목록으로
        </Link>
        <p className="text-xs uppercase tracking-wide text-primary font-semibold mt-3">
          {notice.category === "event"
            ? "이벤트"
            : notice.category === "update"
              ? "안내"
              : "공지"}
        </p>
        <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mt-2">
          {notice.title}
        </h1>
        <time className="text-sm text-text-muted-light dark:text-text-muted-dark">
          {new Date(notice.createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>

      <article className="prose dark:prose-invert max-w-none bg-card rounded-2xl border border-default shadow-sm p-6">
        {notice.content.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </article>
    </div>
  );
}


