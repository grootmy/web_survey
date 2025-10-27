'use client';

import Link from 'next/link';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-light/80 bg-card-light/80 backdrop-blur-sm dark:border-border-dark/60 dark:bg-card-dark/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-text-light dark:text-text-dark">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-sm font-bold text-white shadow-card">A</span>
          <span className="hidden sm:inline">관리자 패널</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-lg border border-border-light/70 bg-surface px-3 py-2 text-sm text-muted dark:border-border-dark/60 dark:text-text-muted-dark">
            관리자
          </span>
        </div>
      </div>
    </header>
  );
}
