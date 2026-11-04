import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { z } from "zod"

import { AdminLoadError, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { PostEditor } from "@/components/admin/blog/post-editor"
import { Band } from "@/components/page-band"
import { getPostForAdmin, listBlogCategories } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Editar publicación · Administración",
  robots: { index: false },
}

export default function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  return (
    <Band className="py-3 pb-16 md:py-3 md:pb-20">
      <Suspense fallback={<AdminSectionSkeleton />}>
        <EditPost params={params} />
      </Suspense>
    </Band>
  )
}

async function EditPost({ params }: { params: PageProps<"/admin/blog/[id]">["params"] }) {
  const { id } = await params
  if (!z.uuid().safeParse(id).success) notFound()

  const [post, categories] = await Promise.all([getPostForAdmin(id), listBlogCategories()])
  if (!post) notFound()
  if (!categories) {
    return (
      <div className="p-5 sm:p-8">
        <AdminLoadError />
      </div>
    )
  }
  // key: al volver a esta publicación, el editor arranca con lo último guardado
  return <PostEditor key={post.id} post={post} categories={categories} />
}
