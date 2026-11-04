import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AdminEmpty } from "@/components/admin/admin-ui"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { BlogSearch } from "@/components/blog/blog-search"
import { CategoryFilter } from "@/components/blog/category-filter"
import { FeaturedPostCard, PostGrid } from "@/components/blog/post-card"
import { GridSection, HeroGlow } from "@/components/grid-section"
import { BrandHighlight, Eyebrow, PageHero } from "@/components/page-hero"
import { pillLinkVariants } from "@/components/pill-link"
import { ROUTES } from "@/config/navigation"
import { listPublicCategories, listPublicPosts } from "@/lib/blog"
import { blogHref, SEARCH_MAX } from "@/lib/blog-shared"

export const metadata: Metadata = {
  title: "Blog",
  description: "Notas sobre tecnología, comunicación, emprendimiento y finanzas para mujeres y emprendedoras.",
  alternates: { canonical: ROUTES.blog },
}

// Blog público: la publicación principal y la grilla, filtrables por categoría.
export default function BlogPage({ searchParams }: PageProps<"/blog">) {
  return (
    <main className="relative flex flex-1 flex-col">
      <GridSection first>
        <header className="relative overflow-hidden px-5 pt-32 pb-14 sm:px-10 md:pt-40 md:pb-20">
          <HeroGlow />
          <PageHero
            eyebrow={<Eyebrow>Blog</Eyebrow>}
            title={
              <>
                Ideas para <BrandHighlight>seguir creciendo</BrandHighlight>
              </>
            }
            description="Notas sobre tecnología, comunicación, emprendimiento y finanzas para mujeres y emprendedoras."
          />
        </header>
      </GridSection>

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
      <GridSection className="px-5 py-10 sm:px-10">
        <p className="rounded-lg bg-destructive/[0.06] px-4 py-5 text-sm text-destructive">
          No pudimos cargar el blog. Volvé a intentar en un rato.
        </p>
      </GridSection>
    )
  }

  const { featured, posts, total, totalPages } = listing
  const empty = !featured && !posts.length && !total
  const filtered = Boolean(category || query)

  return (
    <>
      <GridSection className="flex flex-col gap-3 px-5 py-3 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        {categories.length > 0 && <CategoryFilter categories={categories} active={category} query={query} />}
        <BlogSearch query={query} category={category} />
      </GridSection>

      {query && !empty && (
        <GridSection className="px-5 py-4 text-sm text-muted-foreground sm:px-10">
          <p role="status" className="[overflow-wrap:anywhere]">
            {total === 1 ? "1 resultado" : `${total} resultados`} para “{query}”
          </p>
        </GridSection>
      )}

      {empty ? (
        <GridSection className="p-5 sm:p-10">
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
        </GridSection>
      ) : (
        <>
          {featured && page === 1 && (
            <GridSection>
              <FeaturedPostCard post={featured} />
            </GridSection>
          )}
          {posts.length > 0 && (
            <GridSection>
              <PostGrid posts={posts} />
            </GridSection>
          )}
          {page > totalPages && !posts.length && (
            <GridSection className="px-5 py-10 text-center text-sm text-muted-foreground sm:px-10">
              Esta página ya no existe.{" "}
              <Link href={blogHref({ category, query })} className="underline decoration-brand underline-offset-3">
                Volver al blog
              </Link>
            </GridSection>
          )}
          {totalPages > 1 && (
            <GridSection>
              <BlogPagination
                page={Math.min(page, totalPages)}
                totalPages={totalPages}
                category={category}
                query={query}
              />
            </GridSection>
          )}
        </>
      )}
    </>
  )
}

function BlogSkeleton() {
  return (
    <div aria-hidden>
      <GridSection className="px-5 py-3 sm:px-10">
        <div className="h-12 w-full max-w-lg animate-pulse rounded-lg bg-foreground/[0.05]" />
      </GridSection>
      <GridSection>
        <div className="h-96 animate-pulse bg-foreground/[0.03]" />
      </GridSection>
    </div>
  )
}
