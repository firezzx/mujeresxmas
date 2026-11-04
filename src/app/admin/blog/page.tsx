import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AdminLoadError, AdminSection, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { PostList } from "@/components/admin/blog/post-list"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { pillLinkVariants } from "@/components/pill-link"
import { ROUTES } from "@/config/navigation"
import { listBlogCategories, listPostsForAdmin } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Blog · Administración",
  robots: { index: false },
}

// Sección Blog: todas las publicaciones, con buscador y filtros.
export default function AdminBlogPage() {
  return (
    <AdminSection
      title="Blog"
      description="Las publicaciones de la comunidad: borradores, programadas y publicadas."
      action={
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link
            href={ROUTES.adminBlogCategorias}
            className={pillLinkVariants({ variant: "outline", size: "md", className: "h-11 rounded-lg" })}
          >
            Categorías
          </Link>
          <ShimmerLink href={ROUTES.adminBlogNueva} size="md">
            Nueva publicación
          </ShimmerLink>
        </div>
      }
    >
      <Suspense fallback={<AdminSectionSkeleton />}>
        <Posts />
      </Suspense>
    </AdminSection>
  )
}

async function Posts() {
  const [posts, categories] = await Promise.all([listPostsForAdmin(), listBlogCategories()])
  if (!posts || !categories) return <AdminLoadError />
  return <PostList posts={posts} categories={categories} />
}
