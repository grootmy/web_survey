// src/app/posts/[id]/edit/page.tsx
import { notFound, redirect } from "next/navigation";
import { fetchPost } from "@/lib/api";
import EditPostForm from "@/features/posts/components/EditPostForm";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const post = await fetchPost(id);
    
    if (!post) {
      return notFound();
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EditPostForm post={post} />
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
