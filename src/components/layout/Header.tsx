"use client";

import UserBadge from "@/components/presentational/UserBadge";
import WriteButton from "@/components/presentational/WriteButton";
import SearchBox from "@/components/presentational/SearchBox";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Menu, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-default px-6 sm:px-10 py-5 bg-card-80 backdrop-blur-sm sticky top-0 z-10">
      <button className="lg:hidden p-2 -ml-2" aria-label="메뉴">
        <Menu className="w-6 h-6" />
      </button>
      <div className="flex-1 max-w-lg mx-auto">
        <SearchBox />
      </div>
      <div className="flex items-center gap-3 sm:gap-5">
        <ThemeToggle />
        <WriteButton />
        <button className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors duration-200" aria-label="알림">
          <Bell className="w-6 h-6" />
        </button>
        <UserBadge />
      </div>
    </header>
  );
}


