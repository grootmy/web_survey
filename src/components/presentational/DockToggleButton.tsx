// src/app/components/DockToggleButton.tsx
"use client";
import { useUIStore } from "@/stores/useUIStore";

export default function DockToggleButton() {
  const open = useUIStore((s) => s.rightDockOpen);
  const toggle = useUIStore((s) => s.toggleDock);
  return (
    <button
      className="inline-flex items-center justify-center rounded-lg border border-border-light bg-card-light px-3 py-1.5 text-sm font-medium text-text-light transition-colors duration-150 hover:-translate-y-0.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
      onClick={toggle}
    >
      {open ? "패널 닫기" : "패널 열기"}
    </button>
  );
}
