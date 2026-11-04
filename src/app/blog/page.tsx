import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AdminEmpty } from "@/components/admin/admin-ui"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { CategoryFilter } from "@/components/blog/category-filter"
import { FeaturedPostCard, PostGrid } from "@/components/blog/post-card"
import { GridSection, HeroGlow } from "@/components/grid-section"
import { BrandHighlight, Eyebrow, PageHero } from "@/components/page-hero"
import { pillLinkVariants } from "@/components/pill-link"
import { ROUTES } from "@/config/navigation"
import { listPublicCategories, listPublicPosts } from "@/lib/blog"

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
  const page = Math.max(1, Number.parseInt(firstValue(params.pagina) ?? "1", 10) || 1)

  const [listing, categories] = await Promise.all([listPublicPosts(category, page), listPublicCategories()])

  if (!listing || !categories) {
    return (
      <GridSection className="px-5 py-10 sm:px-10">
        <p className="rounded-lg bg-destructive/[0.06] px-4 py-5 text-sm text-destructive">
          No pudimos cargar el blog. Volvé a intentar en un rato.
        </p>
      </GridSection>
    )
  }

  const { featured, posts, totalPages } = listing
  const empty = !featured && !posts.length

  return (
    <>
      {categories.length > 0 && (
        <GridSection className="px-5 py-3 sm:px-10">
          <CategoryFilter categories={categories} active={category} />
        </GridSection>
      )}

      {empty ? (
        <GridSection className="p-5 sm:p-10">
          <AdminEmpty
            icon="file-text"
            tone="green"
            title={category ? "No hay publicaciones en esta categoría" : "Muy pronto, las primeras notas"}
            text={
              category ? "Probá con otra categoría o mirá todas las publicaciones." : "Estamos preparando el contenido."
            }
          />
          {category && (
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
              <Link href={ROUTES.blog} className="underline decoration-brand underline-offset-3">
                Volver al blog
              </Link>
            </GridSection>
          )}
          {totalPages > 1 && (
            <GridSection>
              <BlogPagination page={Math.min(page, totalPages)} totalPages={totalPages} category={category} />
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
