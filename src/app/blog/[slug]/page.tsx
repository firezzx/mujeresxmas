import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { PostBanner, PostBody, PostHeader, RelatedPosts } from "@/components/blog/post-article"
import { PostComments, PostCommentsSkeleton } from "@/components/blog/post-comments"
import { ShareButtons } from "@/components/blog/share-buttons"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { HeroLights } from "@/components/landing/screen"
import { BandBackdrop, PAGE_WIDTH_CLASS } from "@/components/page-band"
import { ROUTES } from "@/config/navigation"
import { getPublicPost, listRelatedPosts, type PublicPost } from "@/lib/blog"
import { blogImageUrl } from "@/lib/blog-shared"
import { cn } from "@/lib/utils"

const SITE_NAME = "Mujeres x Más"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

type Props = PageProps<"/blog/[slug]">

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPublicPost(slug)
  if (!post) return { title: "Publicación no encontrada", robots: { index: false } }

  const title = post.metaTitle ?? post.title
  const description = post.metaDescription ?? post.excerpt ?? undefined
  const images = post.coverPath ? [{ url: blogImageUrl(post.coverPath), alt: post.coverAlt ?? "" }] : undefined

  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl ?? `${ROUTES.blog}/${post.slug}` },
    robots: post.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: "es_AR",
      title,
      description,
      url: `${ROUTES.blog}/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.authorName ? [post.authorName] : undefined,
      section: post.categoryName ?? undefined,
      tags: post.tags,
      images,
    },
    twitter: { card: images ? "summary_large_image" : "summary", title, description, images },
  }
}

export default function BlogPostPage({ params }: Props) {
  return (
    <main className="relative flex flex-1 flex-col">
      <Suspense fallback={<PostSkeleton />}>
        <Post params={params} />
      </Suspense>
    </main>
  )
}

// Datos estructurados para que los buscadores entiendan que es un artículo.
function articleJsonLd(post: PublicPost) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    image: post.coverPath ? blogImageUrl(post.coverPath) : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": post.authorName ? "Person" : "Organization", name: post.authorName ?? SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}${ROUTES.blog}/${post.slug}`,
    articleSection: post.categoryName ?? undefined,
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
  }
  // Sin "<" crudos: el texto no puede cerrar la etiqueta <script>
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

async function Post({ params }: { params: Props["params"] }) {
  const { slug } = await params
  const post = await getPublicPost(slug)
  if (!post) notFound()
  const related = await listRelatedPosts(post)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd(post) }} />

      {/* Diseño de revista: título grande, portada a todo el ancho y el texto con más notas al costado */}
      <section className="relative isolate overflow-hidden">
        <HeroLights />
        <div className={cn(PAGE_WIDTH_CLASS, "pt-32 pb-12 md:pt-40 md:pb-16")}>
          <IconHoverArea className="mb-10 w-fit">
            <Link
              href={ROUTES.blog}
              className="flex items-center gap-2 rounded-md text-sm font-medium opacity-80 transition-opacity duration-300 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <HoverIcon name="arrow-left" size={16} />
              Volver al blog
            </Link>
          </IconHoverArea>
          <PostHeader post={post} />
        </div>
      </section>

      <PostBanner post={post} />

      <section
        className={cn(
          PAGE_WIDTH_CLASS,
          "grid gap-14 py-14 md:py-20",
          related.length > 0 && "lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-20"
        )}
      >
        <article className="min-w-0">
          <PostBody post={post} />
          <ShareButtons url={`${SITE_URL}${ROUTES.blog}/${post.slug}`} title={post.title} />
        </article>
        <RelatedPosts
          posts={related}
          className="border-t border-border pt-10 lg:sticky lg:top-28 lg:self-start lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10"
        />
      </section>

      <section className="relative isolate overflow-hidden">
        <BandBackdrop tone="soft" />
        <div className={cn(PAGE_WIDTH_CLASS, "relative py-20 md:py-24")}>
          <Suspense fallback={<PostCommentsSkeleton />}>
            <PostComments postId={post.id} slug={post.slug} />
          </Suspense>
        </div>
      </section>
    </>
  )
}

function PostSkeleton() {
  return (
    <section className={cn(PAGE_WIDTH_CLASS, "pt-32 pb-20 md:pt-40")}>
      <div aria-hidden className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <div className="h-7 w-32 animate-pulse rounded-md bg-foreground/[0.05]" />
        <div className="h-14 w-full animate-pulse rounded-lg bg-foreground/[0.05]" />
        <div className="h-6 w-2/3 animate-pulse rounded-lg bg-foreground/[0.05]" />
      </div>
    </section>
  )
}
