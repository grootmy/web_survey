// src/app/page.tsx
import Carousel from "@/components/ui/Carousel";
import { PopularSection, RecentSection } from "@/components/ui/HomeSections";
import { fetchPopularPosts, fetchRecentPosts } from "@/lib/api";

export default async function HomePage() {
  const [popular, recent] = await Promise.all([
    fetchPopularPosts(3, 'likes'),
    fetchRecentPosts(5),
  ]);
  
  return (
    <div className="max-w-5xl mx-auto">
      <Carousel />
      <PopularSection items={popular} />
      <RecentSection items={recent} />
    </div>
  );
}