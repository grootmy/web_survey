// 간단한 자동 슬라이드 캐러셀 (정적 콘텐츠)
"use client";
import { ArrowRight, Megaphone, Sparkles, Star, Calendar } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Carousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  // CSS keyframes 없이 간단한 translateX 순환 (접근성 단순화)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let idx = 0;
    const slides = track.children.length;
    const tick = () => {
      idx = (idx + 1) % slides;
      track.style.transform = `translateX(-${idx * 100}%)`;
    };
    const id = window.setInterval(tick, 5000);
    return () => window.clearInterval(id);
  }, []);
  
  
  return (
    <section className="mb-12">
      <div className="overflow-hidden rounded-2xl shadow-lg border border-border-light dark:border-border-dark">
        <div ref={trackRef} className="flex transition-transform duration-500 ease-in-out" style={{ width: '400%' }}>
          <Slide 
            bg="from-blue-500 to-blue-600" 
            title="공지사항" 
            subtitle="커뮤니티 이용 규칙 안내" 
            cta="자세히 보기"
            icon="campaign"
            ctaColor="text-blue-600"
          />
          <Slide 
            bg="from-green-500 to-teal-500" 
            title="이달의 추천 관리법" 
            subtitle="건강한 두피를 위한 홈케어" 
            cta="꿀팁 보러가기"
            icon="spa"
            ctaColor="text-green-600"
          />
          <Slide 
            bg="from-purple-500 to-indigo-500" 
            title="화제의 제품 리뷰" 
            subtitle="탈모 샴푸 A, 정말 효과 있을까?" 
            cta="리뷰 전체 보기"
            icon="rate_review"
            ctaColor="text-purple-600"
          />
          <Slide 
            bg="from-yellow-400 to-orange-500" 
            title="커뮤니티 이벤트" 
            subtitle="나만의 관리 후기 공유 이벤트!" 
            cta="이벤트 참여하기"
            icon="event"
            ctaColor="text-yellow-800"
          />
        </div>
      </div>
    </section>
  );
}

function Slide({ bg, title, subtitle, cta, icon, ctaColor }: {
  bg: string;
  title: string;
  subtitle: string;
  cta: string;
  icon: string;
  ctaColor: string;
}) {
  const renderIcon = () => {
    switch (icon) {
      case 'campaign':
        return <Megaphone className="text-3xl" />;
      case 'spa':
        return <Sparkles className="text-3xl" />;
      case 'rate_review':
        return <Star className="text-3xl" />;
      case 'event':
        return <Calendar className="text-3xl" />;
      default:
        return <Megaphone className="text-3xl" />;
    }
  };

  return (
    <div className="min-w-full">
      <a className={`block bg-gradient-to-r ${bg} text-white p-8 md:p-12 relative`} href="#">
        <div className={`absolute inset-0 bg-gradient-to-r ${bg} opacity-90`}></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            {renderIcon()}
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-3">{subtitle}</h3>
          <p className={`text-sm sm:text-base ${bg.includes('blue') ? 'text-blue-100' : bg.includes('green') ? 'text-green-100' : bg.includes('purple') ? 'text-purple-100' : 'text-yellow-100'} line-clamp-2 mb-4`}>
            {bg.includes('blue') ? '모두가 함께 만들어가는 건강한 커뮤니티를 위해 이용 규칙을 꼭 확인해주세요.' :
             bg.includes('green') ? '전문가가 추천하는 집에서 쉽게 따라할 수 있는 두피 관리 꿀팁을 확인해보세요.' :
             bg.includes('purple') ? '사용자들의 솔직한 후기와 평점으로 화제가 된 탈모 샴푸 A의 모든 것을 파헤칩니다.' :
             '정성스러운 후기를 남겨주신 분들 중 추첨을 통해 푸짐한 상품을 드립니다.'}
          </p>
          <div className={`inline-flex items-center gap-2 bg-white ${ctaColor} px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors`}>
            <span>{cta}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </a>
    </div>
  );
}


