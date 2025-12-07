"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, HelpCircle, ShoppingBag, ClipboardList, Scissors, FlaskConical, Hospital, Lightbulb, X } from "lucide-react";
import { useUIStore } from "@/stores/useUIStore";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "홈", icon: <Home size={18} />, isActive: (p) => p === "/" },
  { href: "/boards/qna", label: "Q&A", icon: <HelpCircle size={18} />, isActive: (p) => p.startsWith("/boards/qna") },
  { href: "/boards/product-reviews", label: "제품리뷰", icon: <ShoppingBag size={18} />, isActive: (p) => p.startsWith("/boards/product-reviews") },
  { href: "/boards/manage-reviews", label: "관리후기", icon: <ClipboardList size={18} />, isActive: (p) => p.startsWith("/boards/manage-reviews") },
  { href: "/boards/procedure-reviews", label: "시술후기", icon: <Scissors size={18} />, isActive: (p) => p.startsWith("/boards/procedure-reviews") },
  { href: "/boards/research-news", label: "연구 및 뉴스", icon: <FlaskConical size={18} />, isActive: (p) => p.startsWith("/boards/research-news") },
  { href: "/boards/useful-info", label: "유용 정보", icon: <Lightbulb size={18} />, isActive: (p) => p.startsWith("/boards/useful-info") },
  { href: "/boards/hospital-reviews", label: "병원 후기", icon: <Hospital size={18} />, isActive: (p) => p.startsWith("/boards/hospital-reviews") },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const closeSidebar = useUIStore((state) => state.closeSidebar);

  return (
    <>
      {/* 모바일 오버레이 배경 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* 사이드바 */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 flex-shrink-0 border-r border-default bg-card flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:flex
        `}
      >
        <div className="flex items-center justify-between text-text-light dark:text-text-dark px-8 py-6 border-b border-default">
          <Link
            href="/"
            onClick={closeSidebar}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg"
          >
            <Image src="/logo.png" alt="logo" width={32} height={32} />
            <h2 className="text-2xl font-bold tracking-tight">헤카이브</h2>
          </Link>
          <button
            className="lg:hidden p-2 hover:bg-background-light dark:hover:bg-background-dark rounded-lg transition-colors"
            onClick={closeSidebar}
            aria-label="메뉴 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-6 space-y-2">
          {navItems.map((item) => {
            const active = item.isActive(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-4 px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200 ${
                  active
                    ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                    : "text-text-muted-light dark:text-text-muted-dark hover:bg-background-light dark:hover:bg-background-dark hover:text-primary"
                }`}
              >
                <span className="inline-flex items-center gap-2">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}


