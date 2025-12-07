// src/app/components/RightDock.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useUIStore } from "@/stores/useUIStore";
import { MessageCircle, X } from "lucide-react";

export default function RightDock() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const open = useUIStore((s) => s.rightDockOpen);
  const toggle = useUIStore((s) => s.toggleDock);
  const close = useUIStore((s) => s.closeDock);

  // ESC로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // 닫힐 때 토글 버튼에 포커스 복귀(접근성)
  useEffect(() => {
    if (!open) btnRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* 채널톡 스타일 플로팅 버튼 */}
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls="help-modal"
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={toggle}
        title="도움말"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* 모달 오버레이 */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={close}>
          <div className="fixed bottom-20 right-6 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">도움말</h2>
              <button
                onClick={close}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">인기 태그</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">#병원</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">#후기</span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">#서울</span>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">공지사항</h3>
                <div className="space-y-2">
                  <Link href="/posts/1" className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-white text-xs font-bold rounded-full">1</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">필독! 게시판 이용 규칙</span>
                    </div>
                  </Link>
                  <Link href="/posts/2" className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-white text-xs font-bold rounded-full">2</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">매너 가이드</span>
                    </div>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
