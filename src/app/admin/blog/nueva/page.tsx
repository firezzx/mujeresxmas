import type { Metadata } from "next"
import { Suspense } from "react"

import { AdminLoadError, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { PostEditor } from "@/components/admin/blog/post-editor"
import { Band } from "@/components/page-band"
import { listBlogCategories } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Nueva publicación · Administración",
  robots: { index: false },
}

export default function NewPostPage() {
  return (
    <Band className="py-3 pb-16 md:py-3 md:pb-20">
      <Suspense fallback={<AdminSectionSkeleton />}>
        <NewPost />
      </Suspense>
    </Band>
  )
}

async function NewPost() {
  const categories = await listBlogCategories()
  if (!categories) {
    return (
      <div className="p-5 sm:p-8">
        <AdminLoadError />
      </div>
    )
  }
  return <PostEditor post={null} categories={categories} />
}
