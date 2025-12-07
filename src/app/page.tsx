// src/app/page.tsx
import Carousel from "@/components/ui/Carousel";
import { PopularSection, RecentSection } from "@/components/ui/HomeSections";
import { fetchPopularPosts, fetchRecentPosts, fetchNotices } from "@/lib/api";

export default async function HomePage() {
  const [popular, recent, notices] = await Promise.all([
    fetchPopularPosts(3, 'likes'),
    fetchRecentPosts(5),
    fetchNotices(),
  ]);
  const featuredNotice = notices.find((n) => n.featured) ?? notices[0];
  
  return (
    <div className="max-w-5xl mx-auto">
      <Carousel featuredNotice={featuredNotice} />
      <PopularSection items={popular} />
      <RecentSection items={recent} />
    </div>
  );
}