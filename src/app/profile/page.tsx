"use client";
import { useAuth } from "@/features/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchMyStats, fetchMyPosts, fetchMyComments, fetchMyBookmarks, type MyStats } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<MyStats | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'bookmarks'>('posts');
  const [list, setList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const formatDate = (d?: any) => {
    try {
      return new Date(d ?? new Date()).toLocaleString('ko-KR', { hour12: false });
    } catch {
      return '';
    }
  };

  const getPostId = (item: any): string => String(item?.post_id ?? item?.id ?? item?.post?.post_id ?? "");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user) {
      fetchMyStats().then(setStats).catch(() => setStats(null));
    }
  }, [loading, user]);

  useEffect(() => {
    if (!loading || !user) return;
  }, [loading, user]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoadingList(true);
      try {
        if (activeTab === 'posts') {
          const { items } = await fetchMyPosts(1, 10);
          setList(items);
        } else if (activeTab === 'comments') {
          const { items } = await fetchMyComments(1, 10);
          setList(items);
        } else {
          const { items } = await fetchMyBookmarks(1, 10);
          setList(items);
        }
      } finally {
        setLoadingList(false);
      }
    };
    load();
  }, [activeTab, user]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initial = (user.nickname || "U")[0].toUpperCase();

  return (
    <div className="container">
      <div className="max-w-3xl mx-auto">
        {/* 헤더 카드 */}
        <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary text-white grid place-items-center text-2xl font-bold">
            {initial}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-light dark:text-text-dark">{user.nickname || "닉네임 없음"}</h1>
            <p className="text-text-muted-light dark:text-text-muted-dark">@{user.handle}</p>
            {user.name && user.name.trim() && <p className="text-sm text-text-muted-light dark:text-text-muted-dark">이름: {user.name}</p>}
            {user.bio && <p className="mt-1 text-text-light dark:text-text-dark">{user.bio}</p>}
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md" onClick={() => router.push("/settings")}>
            프로필 편집
          </button>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <StatCard label="게시글" value={stats?.total_posts ?? 0} />
          <StatCard label="댓글" value={stats?.total_comments ?? 0} />
          <StatCard label="좋아요" value={stats?.likes_received ?? 0} />
        </div>

        {/* 탭 + 목록 */}
        <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden mt-8">
          <div className="flex border-b border-border-light dark:border-border-dark">
            {([['posts','게시글'],['comments','댓글'],['bookmarks','북마크']] as const).map(([key,label]) => (
              <button key={key} onClick={() => setActiveTab(key as any)} className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab===key? 'text-white bg-primary' : 'text-text-muted-light dark:text-text-muted-dark hover:bg-background-light dark:hover:bg-background-dark'}`}>{label}</button>
            ))}
          </div>

          <div className="p-0">
            {loadingList ? (
              <div className="loading">로딩 중...</div>
            ) : list.length === 0 ? (
              <div className="empty-state">
                <p>{activeTab === 'posts' ? '아직 작성한 게시글이 없습니다.' : activeTab === 'comments' ? '아직 작성한 댓글이 없습니다.' : '아직 북마크한 게시글이 없습니다.'}</p>
                {activeTab === 'posts' && (
                  <button
                    className="inline-flex items-center justify-center rounded-lg border border-border-light bg-card-light px-4 py-2 text-sm font-medium text-text-light transition-colors duration-150 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                    onClick={() => router.push("/posts/new")}
                  >
                    첫 게시글 작성하기
                  </button>
                )}
              </div>
            ) : (
              <div>
                <ul className="divide-y divide-border-light dark:divide-border-dark">
                  {list.map((item, idx) => {
                    const postId = getPostId(item);
                    if (activeTab === 'posts' || activeTab === 'bookmarks') {
                      return (
                        <li key={idx} className="p-6 hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-200">
                          <Link href={postId ? `/posts/${postId}` : '#'} className="block">
                            <div className="text-base font-semibold text-text-light dark:text-text-dark mb-1">{item.title ?? '(제목 없음)'}</div>
                            <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                              {formatDate(item.created_at || item.createdAt)}
                              {typeof item.view_count === 'number' && (
                                <>
                                  <span className="mx-2">·</span>
                                  조회 {item.view_count}
                                </>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    }
                    return (
                      <li key={idx} className="p-6 hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-200">
                        <Link href={postId ? `/posts/${postId}` : '#'} className="block">
                          <div className="text-text-light dark:text-text-dark truncate">{item.content ?? item.body ?? ''}</div>
                          <div className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                            {formatDate(item.created_at || item.createdAt)}
                            {item?.post?.title && (
                              <>
                                <span className="mx-2">·</span>
                                원문: {item.post.title}
                              </>
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-text-muted-light dark:text-text-muted-dark">{label}</div>
    </div>
  );
}
