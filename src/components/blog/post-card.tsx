import Link from "next/link"

import { BrandCard } from "@/components/account/account-card"
import { BlogCover } from "@/components/blog/blog-cover"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import type { PostCardData } from "@/lib/blog-shared"
import { cn } from "@/lib/utils"
import { formatDay } from "@/lib/format"

const postHref = (slug: string) => `${ROUTES.blog}/${slug}`

// Portada de la tarjeta: completa sobre su fondo difuminado; sin portada, un ícono
function Cover({
  post,
  index,
  sizes,
  priority,
  className,
}: {
  post: PostCardData
  index: number
  sizes: string
  priority?: boolean
  className?: string
}) {
  const frame = cn("w-full rounded-lg", className)
  if (!post.coverPath) {
    return (
      <span className={cn(frame, "flex items-center justify-center bg-foreground/[0.03]")}>
        <IconBadge tone={cycleTone(index)} size="lg">
          <HoverIcon name="file-text" size={24} />
        </IconBadge>
      </span>
    )
  }
  return (
    <BlogCover
      path={post.coverPath}
      alt={post.coverAlt}
      sizes={sizes}
      priority={priority}
      zoomOnHover
      className={frame}
    />
  )
}

function Details({ post }: { post: PostCardData }) {
  return (
    <span className="block text-sm text-muted-foreground">
      {formatDay(post.publishedAt)} · {post.readingMinutes} min de lectura
    </span>
  )
}

function CategoryLabel({ post }: { post: PostCardData }) {
  if (!post.categoryName) return null
  return (
    <span className="w-fit max-w-full rounded-md bg-brand-soft/60 px-2.5 py-1 text-[13px] font-medium">
      {post.categoryName}
    </span>
  )
}

const CARD_LINK_CLASS = "group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"

// La publicación principal del blog, a todo el ancho: portada arriba (sirve igual para banners
// anchos y fotos) y debajo el título a la izquierda y la bajada a la derecha.
export function FeaturedPostCard({ post }: { post: PostCardData }) {
  return (
    <IconHoverArea>
      <BlurFade inView>
        <Link href={postHref(post.slug)} className={CARD_LINK_CLASS}>
          <BrandCard contentClassName="flex flex-col gap-6 p-3 sm:p-4 md:gap-8">
            <Cover
              post={post}
              index={0}
              sizes="(min-width: 1280px) 76rem, 100vw"
              priority
              className="aspect-[2/1] md:aspect-[3/1]"
            />
            <span className="grid gap-4 px-2 pb-3 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-end md:gap-10 md:px-4 md:pb-5">
              <span className="flex min-w-0 flex-col items-start gap-4">
                <CategoryLabel post={post} />
                <span className="font-heading text-2xl leading-tight font-semibold tracking-[-0.01em] text-balance [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-brand-green-strong sm:text-3xl lg:text-4xl">
                  {post.title}
                </span>
              </span>
              <span className="flex min-w-0 flex-col gap-3">
                {post.excerpt && (
                  <span className="text-[15px] leading-relaxed text-pretty [overflow-wrap:anywhere] text-muted-foreground sm:text-base">
                    {post.excerpt}
                  </span>
                )}
                <Details post={post} />
              </span>
            </span>
          </BrandCard>
        </Link>
      </BlurFade>
    </IconHoverArea>
  )
}

function PostCard({ post, index }: { post: PostCardData; index: number }) {
  return (
    <IconHoverArea className="min-w-0">
      <BlurFade delay={(index % 3) * 0.06} inView className="h-full">
        <Link href={postHref(post.slug)} className={CARD_LINK_CLASS}>
          <BrandCard contentClassName="flex flex-col gap-4 p-3 pb-5 sm:p-4 sm:pb-6">
            <Cover
              post={post}
              index={index + 1}
              sizes="(min-width: 1024px) 29rem, (min-width: 640px) 50vw, 100vw"
              className="aspect-[2/1]"
            />
            <span className="flex flex-1 flex-col items-start gap-3 px-2">
              <CategoryLabel post={post} />
              <span className="font-heading text-xl leading-snug font-semibold tracking-[-0.01em] text-balance [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-brand-green-strong sm:text-2xl">
                {post.title}
              </span>
              {post.excerpt && (
                <span className="line-clamp-3 text-[15px] leading-relaxed text-pretty [overflow-wrap:anywhere] text-muted-foreground">
                  {post.excerpt}
                </span>
              )}
              <span className="mt-auto">
                <Details post={post} />
              </span>
            </span>
          </BrandCard>
        </Link>
      </BlurFade>
    </IconHoverArea>
  )
}

export function PostGrid({ posts }: { posts: PostCardData[] }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  )
}
