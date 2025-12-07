"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth-context";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function AccountMenu() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  if (loading || !user) return null;

  const initial = (user.nickname || "U")[0].toUpperCase();

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="사용자 메뉴"
        onClick={() => setOpen(v => !v)}
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2">
          {/* 사용자 정보 섹션 */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold text-sm">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white truncate">
                  {user.nickname}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  @{user.handle}
                </div>
              </div>
            </div>
          </div>

          {/* 메뉴 항목들 */}
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <User className="w-4 h-4" />
              내 프로필
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              계정 설정
            </Link>
            <button
              onClick={async () => {
                await logout();
                setOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
