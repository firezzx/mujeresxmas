import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { z } from "zod"

import { AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { PostStatusBadge } from "@/components/admin/blog/post-status-badge"
import { PostArticle } from "@/components/blog/post-article"
import { Band } from "@/components/page-band"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { pillLinkVariants } from "@/components/pill-link"
import { ROUTES } from "@/config/navigation"
import { getPostPreview } from "@/lib/blog"
import { postDisplayStatus } from "@/lib/blog-shared"

export const metadata: Metadata = {
  title: "Vista previa · Administración",
  robots: { index: false },
}

// La publicación tal como quedó guardada, también si todavía es un borrador.
export default function PostPreviewPage({ params }: PageProps<"/admin/blog/[id]/vista-previa">) {
  return (
    <Band className="py-3 pb-16 md:py-3 md:pb-20">
      <Suspense fallback={<AdminSectionSkeleton />}>
        <Preview params={params} />
      </Suspense>
    </Band>
  )
}

async function Preview({ params }: { params: PageProps<"/admin/blog/[id]/vista-previa">["params"] }) {
  const { id } = await params
  if (!z.uuid().safeParse(id).success) notFound()

  const post = await getPostPreview(id)
  if (!post) notFound()

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <PostStatusBadge status={postDisplayStatus(post.status, post.publishedAt)} />
          <p className="text-[13px] text-muted-foreground">Vista previa: muestra lo último guardado.</p>
        </div>
        <IconHoverArea>
          <Link href={`${ROUTES.adminBlog}/${id}`} className={pillLinkVariants({ variant: "outline", size: "md" })}>
            <HoverIcon name="square-pen" size={16} />
            Editar
          </Link>
        </IconHoverArea>
      </div>
      <div className="bg-background px-5 py-10 sm:px-8 md:py-16">
        <PostArticle post={post} />
      </div>
    </div>
  )
}
