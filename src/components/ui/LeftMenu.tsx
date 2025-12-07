// src/components/ui/LeftMenu.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getBoards } from "@/lib/mock";

export default function LeftMenu() {
  const boards = getBoards();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="panel">
      <h3>탐색</h3>
      <div className="nav-list">
        {/* 전체 게시글 링크 */}
        <Link 
          className={`nav-item ${pathname === "/" ? "active" : ""}`} 
          href="/"
        >
          🏠 전체 게시글
        </Link>

        <div className="nav-divider"></div>

        {boards.map(b => (
          <div key={b.id}>
            <Link 
              className={`nav-item ${pathname === `/boards/${b.slug}` ? "active" : ""}`} 
              href={`/boards/${b.slug}`}
            >
              {getBoardIcon(b.id)} {b.title}
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
}

function getBoardIcon(boardId: string): string {
  const icons: Record<string, string> = {
    qna: "❓",
    "product-reviews": "🛍️",
    "manage-reviews": "📝",
    "procedure-reviews": "✂️",
    "research-news": "🧪",
    "useful-info": "💡",
    clinics: "🏥"
  };
  return icons[boardId] || "📝";
}
