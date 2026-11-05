import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AdminEmpty } from "@/components/admin/admin-ui"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { BlogSearch } from "@/components/blog/blog-search"
import { CategoryFilter } from "@/components/blog/category-filter"
import { FeaturedPostCard, PostGrid } from "@/components/blog/post-card"
import { Band, ColorHero, OVERLAP_CLASS } from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { pillLinkVariants } from "@/components/pill-link"
import { ROUTES } from "@/config/navigation"
import { listPublicCategories, listPublicPosts } from "@/lib/blog"
import { blogHref, SEARCH_MAX } from "@/lib/blog-shared"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Blog",
  description: "Notas sobre tecnología, comunicación, emprendimiento y finanzas para mujeres y emprendedoras.",
  alternates: { canonical: ROUTES.blog },
}

// Blog público: la publicación principal y la grilla, filtrables por categoría.
export default function BlogPage({ searchParams }: PageProps<"/blog">) {
  return (
    <main className="relative flex flex-1 flex-col">
      <ColorHero
        overlap
        eyebrow="Blog"
        title={
          <>
            Ideas para <BrandHighlight>seguir creciendo</BrandHighlight>
          </>
        }
        description="Notas sobre tecnología, comunicación, emprendimiento y finanzas para mujeres y emprendedoras."
      />

      <Suspense fallback={<BlogSkeleton />}>
        <BlogListing searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

function firstValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : null
}

async function BlogListing({ searchParams }: { searchParams: PageProps<"/blog">["searchParams"] }) {
  const params = await searchParams
  const category = firstValue(params.categoria)
  const query = firstValue(params.q)?.trim().slice(0, SEARCH_MAX) || null
  const page = Math.max(1, Number.parseInt(firstValue(params.pagina) ?? "1", 10) || 1)

  const [listing, categories] = await Promise.all([listPublicPosts(category, page, query), listPublicCategories()])

  if (!listing || !categories) {
    return (
      <Band className={OVERLAP_CLASS}>
        <p className="rounded-lg bg-destructive/[0.06] px-4 py-5 text-sm text-destructive">
          No pudimos cargar el blog. Volvé a intentar en un rato.
        </p>
      </Band>
    )
  }

  const { featured, posts, total, totalPages } = listing
  const empty = !featured && !posts.length && !total
  const filtered = Boolean(category || query)

  return (
    <Band className={cn(OVERLAP_CLASS, "flex flex-col gap-6")}>
      <div className="flex flex-col gap-3 rounded-xl bg-background p-3 shadow-[0_24px_48px_-24px_rgb(26_26_26/0.35)] lg:flex-row lg:items-center lg:justify-between">
        {categories.length > 0 && <CategoryFilter categories={categories} active={category} query={query} />}
        <BlogSearch query={query} category={category} />
      </div>

      {query && !empty && (
        <p role="status" className="text-sm [overflow-wrap:anywhere] text-muted-foreground">
          {total === 1 ? "1 resultado" : `${total} resultados`} para “{query}”
        </p>
      )}

      {empty ? (
        <div>
          <AdminEmpty
            icon="file-text"
            tone="green"
            title={
              query
                ? "No encontramos notas con esa búsqueda"
                : category
                  ? "No hay publicaciones en esta categoría"
                  : "Muy pronto, las primeras notas"
            }
            text={
              query
                ? "Probá con otras palabras o mirá todas las publicaciones."
                : category
                  ? "Probá con otra categoría o mirá todas las publicaciones."
                  : "Estamos preparando el contenido."
            }
          />
          {filtered && (
            <div className="mt-6 flex justify-center">
              <Link href={ROUTES.blog} className={pillLinkVariants({ variant: "outline", className: "rounded-lg" })}>
                Ver todas
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {featured && page === 1 && <FeaturedPostCard post={featured} />}
          {posts.length > 0 && <PostGrid posts={posts} />}
          {page > totalPages && !posts.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Esta página ya no existe.{" "}
              <Link href={blogHref({ category, query })} className="underline decoration-brand underline-offset-3">
                Volver al blog
              </Link>
            </p>
          )}
          {totalPages > 1 && (
            <BlogPagination
              page={Math.min(page, totalPages)}
              totalPages={totalPages}
              category={category}
              query={query}
            />
          )}
        </>
      )}
    </Band>
  )
}

function BlogSkeleton() {
  return (
    <Band className={cn(OVERLAP_CLASS, "flex flex-col gap-6")}>
      <div aria-hidden className="h-16 animate-pulse rounded-xl bg-background shadow-sm" />
      <div aria-hidden className="h-96 animate-pulse rounded-xl bg-foreground/[0.04]" />
    </Band>
  )
}
