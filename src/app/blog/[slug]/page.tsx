import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { PostBody, PostHeader } from "@/components/blog/post-article"
import { PostComments, PostCommentsSkeleton } from "@/components/blog/post-comments"
import { PostGrid } from "@/components/blog/post-card"
import { ShareButtons } from "@/components/blog/share-buttons"
import { Band, OVERLAP_CLASS, SectionTitle } from "@/components/page-band"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BRAND_HEX } from "@/config/brand-effects"
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

      <Band tone="pink" dots className={cn("pt-28 md:pt-36", post.coverPath ? "pb-24 md:pb-32" : "pb-14 md:pb-20")}>
        <div className="mx-auto mb-8 w-full max-w-4xl">
          <IconHoverArea className="w-fit">
            <Link
              href={ROUTES.blog}
              className="flex items-center gap-2 rounded-md text-sm font-medium opacity-80 transition-opacity duration-300 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <HoverIcon name="arrow-left" size={16} />
              Volver al blog
            </Link>
          </IconHoverArea>
        </div>
        <PostHeader post={post} />
      </Band>

      <Band className={cn("pb-14 md:pb-20", post.coverPath && OVERLAP_CLASS)}>
        <article>
          <PostBody post={post} />
        </article>
        <div className="mx-auto w-full max-w-4xl">
          <ShareButtons url={`${SITE_URL}${ROUTES.blog}/${post.slug}`} title={post.title} />
        </div>
      </Band>

      <Band tone="soft" dots>
        <Suspense fallback={<PostCommentsSkeleton />}>
          <PostComments postId={post.id} slug={post.slug} />
        </Suspense>
      </Band>

      {related.length > 0 && (
        <Band>
          <SectionTitle
            title="Seguí"
            highlight="leyendo"
            highlightStyle={{ action: "underline", color: BRAND_HEX.brand }}
          />
          <PostGrid posts={related} />
        </Band>
      )}
    </>
  )
}

function PostSkeleton() {
  return (
    <Band tone="pink" dots className="pt-28 pb-20 md:pt-36">
      <div aria-hidden className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <div className="h-7 w-32 animate-pulse rounded-md bg-background/50" />
        <div className="h-14 w-full animate-pulse rounded-lg bg-background/50" />
        <div className="h-6 w-2/3 animate-pulse rounded-lg bg-background/50" />
      </div>
    </Band>
  )
}
