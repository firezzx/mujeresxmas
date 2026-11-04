import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AdminLoadError, AdminSection, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { CategoryManager } from "@/components/admin/blog/category-manager"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { pillLinkVariants } from "@/components/pill-link"
import { ROUTES } from "@/config/navigation"
import { listBlogCategories } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Categorías del blog · Administración",
  robots: { index: false },
}

// Categorías del blog: sirven para ordenar las publicaciones y filtrarlas en la página pública.
export default function BlogCategoriesPage() {
  return (
    <AdminSection
      title="Categorías del blog"
      description="Sirven para ordenar las publicaciones y filtrarlas en el blog."
      action={
        <IconHoverArea className="shrink-0">
          <Link
            href={ROUTES.adminBlog}
            className={pillLinkVariants({ variant: "outline", size: "md", className: "h-11 rounded-lg" })}
          >
            <HoverIcon name="arrow-left" size={16} />
            Publicaciones
          </Link>
        </IconHoverArea>
      }
    >
      <Suspense fallback={<AdminSectionSkeleton />}>
        <Categories />
      </Suspense>
    </AdminSection>
  )
}

async function Categories() {
  const categories = await listBlogCategories()
  if (!categories) return <AdminLoadError />
  return <CategoryManager categories={categories} />
}
