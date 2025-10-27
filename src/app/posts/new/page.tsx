// src/app/posts/new/page.tsx
"use client";

// 기존: import NewPostForm from "@/features/posts/components/NewPostForm";
import NewPostForm from "../../../features/posts/components/NewPostForm";

export default function NewPostPage() {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
      <NewPostForm />
    </div>
  );
}
