import type { Metadata } from "next"
import { Suspense } from "react"

import { AdminLoadError, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { PostEditor } from "@/components/admin/blog/post-editor"
import { GridSection } from "@/components/grid-section"
import { listBlogCategories } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Nueva publicación · Administración",
  robots: { index: false },
}

export default function NewPostPage() {
  return (
    <GridSection>
      <Suspense fallback={<AdminSectionSkeleton />}>
        <NewPost />
      </Suspense>
    </GridSection>
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
