'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminMenuItems = [
  {
    title: '대시보드',
    href: '/admin',
    icon: '📊',
  },
  {
    title: '사용자 관리',
    href: '/admin/users',
    icon: '👥',
  },
  {
    title: '게시물 관리',
    href: '/admin/posts',
    icon: '📝',
  },
  {
    title: '카테고리 관리',
    href: '/admin/categories',
    icon: '🏷️',
  },
  {
    title: '태그 관리',
    href: '/admin/tags',
    icon: '🏷️',
  },
  {
    title: '댓글 관리',
    href: '/admin/comments',
    icon: '💬',
  },
  {
    title: '통계 분석',
    href: '/admin/analytics',
    icon: '📈',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {adminMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'nav-item',
                    isActive && 'bg-accent text-white border-accent'
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
