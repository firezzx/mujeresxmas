import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { PostArticle } from "@/components/blog/post-article"
import { PostComments, PostCommentsSkeleton } from "@/components/blog/post-comments"
import { PostGrid } from "@/components/blog/post-card"
import { ShareButtons } from "@/components/blog/share-buttons"
import { GridSection } from "@/components/grid-section"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { ROUTES } from "@/config/navigation"
import { getPublicPost, listRelatedPosts, type PublicPost } from "@/lib/blog"
import { blogImageUrl } from "@/lib/blog-shared"

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

      <GridSection first>
        <div className="px-5 pt-28 pb-14 sm:px-8 md:pt-36 md:pb-20">
          <div className="mx-auto mb-8 w-full max-w-4xl">
            <IconHoverArea className="w-fit">
              <Link
                href={ROUTES.blog}
                className="flex items-center gap-2 rounded-md text-sm font-medium text-foreground/60 transition-colors duration-300 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <HoverIcon name="arrow-left" size={16} />
                Volver al blog
              </Link>
            </IconHoverArea>
          </div>
          <PostArticle post={post} />
          <div className="mx-auto w-full max-w-4xl">
            <ShareButtons url={`${SITE_URL}${ROUTES.blog}/${post.slug}`} title={post.title} />
          </div>
        </div>
      </GridSection>

      <GridSection>
        <div className="px-5 py-10 sm:px-8 md:py-14">
          <Suspense fallback={<PostCommentsSkeleton />}>
            <PostComments postId={post.id} slug={post.slug} />
          </Suspense>
        </div>
      </GridSection>

      {related.length > 0 && (
        <>
          <GridSection className="px-5 py-8 sm:px-8">
            <h2 className="font-heading text-xl font-semibold tracking-[-0.01em]">Seguí leyendo</h2>
          </GridSection>
          <GridSection>
            <PostGrid posts={related} />
          </GridSection>
        </>
      )}
    </>
  )
}

function PostSkeleton() {
  return (
    <GridSection first>
      <div aria-hidden className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-5 pt-28 pb-20 md:pt-36">
        <div className="h-7 w-32 animate-pulse rounded-md bg-foreground/[0.05]" />
        <div className="h-14 w-full animate-pulse rounded-lg bg-foreground/[0.06]" />
        <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-foreground/[0.04]" />
      </div>
    </GridSection>
  )
}
