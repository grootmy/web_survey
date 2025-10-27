"use client";

import { useTheme } from "@/features/theme/theme-provider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  const isDark = mode === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      className="relative inline-flex h-11 w-20 items-center rounded-full border border-default bg-card shadow-soft transition-colors duration-300"
      aria-label="테마 토글"
    >
      <span className={`absolute inset-0 flex items-center justify-between px-3 text-sm ${isDark ? "text-text-dark" : "text-text-light"}`}>
        <Sun className="h-4 w-4" />
        <Moon className="h-4 w-4" />
      </span>
      <span
        className={`absolute left-1 top-1 h-9 w-9 rounded-full bg-background-light dark:bg-background-dark shadow-card transform transition-transform duration-300 ${isDark ? "translate-x-9" : "translate-x-0"}`}
      />
    </button>
  );
}


