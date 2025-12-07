//src/app/components/SearchBox.tsx
"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePostFiltersStore } from "@/stores/usePostFilters";
import { Search } from "lucide-react";

export default function SearchBox() {
  const { query, setQuery } = usePostFiltersStore();
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // "/" 단축키 포커스
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && (document.activeElement as HTMLElement | null)?.tagName !== "INPUT") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form onSubmit={handleSearch} className="relative" aria-label="검색">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark w-5 h-5" />
      <input
        ref={ref}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="무엇이든 검색해보세요..."
        className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-primary rounded-full pl-12 pr-4 py-2.5 text-sm transition-all duration-200"
        type="search"
      />
    </form>
  );
}
