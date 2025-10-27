"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, HelpCircle, ShoppingBag, ClipboardList, Scissors, FlaskConical, Hospital } from "lucide-react";

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
  { href: "/boards/hospital-reviews", label: "병원 후기", icon: <Hospital size={18} />, isActive: (p) => p.startsWith("/boards/hospital-reviews") },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-72 flex-shrink-0 border-r border-default bg-card flex-col">
      <div className="flex items-center gap-3 text-text-light dark:text-text-dark px-8 py-6 border-b border-default">
        <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
        <h2 className="text-2xl font-bold tracking-tight">헤카이브</h2>
      </div>

      <nav className="p-6 space-y-2">
        {navItems.map((item) => {
          const active = item.isActive(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
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
  );
}


