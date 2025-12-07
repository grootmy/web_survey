"use client";

import { usePathname } from "next/navigation";
import RightDock from "@/components/containers/RightDock";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <div className="relative flex min-h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 px-4 sm:px-6 lg:px-12 py-10 bg-[var(--bg)]">
            {children}
          </main>
        </div>
      </div>
      <Footer />
      <RightDock />
    </>
  );
}
