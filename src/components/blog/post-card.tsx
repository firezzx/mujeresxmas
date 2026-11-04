import Image from "next/image"
import Link from "next/link"

import { GRID_CELLS_CLASS } from "@/components/grid-section"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import { blogImageUrl, type PostCardData } from "@/lib/blog-shared"
import { formatDay } from "@/lib/format"
import { cn } from "@/lib/utils"

const postHref = (slug: string) => `${ROUTES.blog}/${slug}`

function Cover({
  post,
  index,
  sizes,
  priority,
}: {
  post: PostCardData
  index: number
  sizes: string
  priority?: boolean
}) {
  return (
    <span className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg bg-foreground/[0.03]">
      {post.coverPath ? (
        <Image
          src={blogImageUrl(post.coverPath)}
          alt={post.coverAlt ?? ""}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
        />
      ) : (
        <IconBadge tone={cycleTone(index)} size="lg">
          <HoverIcon name="file-text" size={24} />
        </IconBadge>
      )}
    </span>
  )
}

function Details({ post }: { post: PostCardData }) {
  return (
    <span className="block text-[13px] text-muted-foreground">
      {formatDay(post.publishedAt)} · {post.readingMinutes} min de lectura
    </span>
  )
}

function CategoryLabel({ post }: { post: PostCardData }) {
  if (!post.categoryName) return null
  return (
    <span className="w-fit rounded-md bg-brand-soft/60 px-2.5 py-1 text-[12px] font-medium">{post.categoryName}</span>
  )
}

const CARD_LINK_CLASS =
  "group flex h-full flex-col outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/40"

// La publicación principal del blog, a todo el ancho.
export function FeaturedPostCard({ post }: { post: PostCardData }) {
  return (
    <IconHoverArea className="bg-background">
      <BlurFade delay={0.1} inView>
        <Link
          href={postHref(post.slug)}
          className={cn(CARD_LINK_CLASS, "gap-6 p-5 sm:p-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-10")}
        >
          <Cover post={post} index={0} sizes="(min-width: 1024px) 38rem, 100vw" priority />
          <span className="flex flex-col items-start gap-4">
            <CategoryLabel post={post} />
            <span className="font-heading text-2xl leading-tight font-semibold tracking-[-0.02em] text-balance transition-colors duration-300 group-hover:text-brand sm:text-[2rem]">
              {post.title}
            </span>
            {post.excerpt && (
              <span className="text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-base">
                {post.excerpt}
              </span>
            )}
            <Details post={post} />
          </span>
        </Link>
      </BlurFade>
    </IconHoverArea>
  )
}

function PostCard({ post, index }: { post: PostCardData; index: number }) {
  return (
    <IconHoverArea className="bg-background">
      <BlurFade delay={0.1 + (index % 3) * 0.06} inView className="h-full">
        <Link href={postHref(post.slug)} className={cn(CARD_LINK_CLASS, "gap-4 p-5 sm:p-6")}>
          <Cover post={post} index={index + 1} sizes="(min-width: 1024px) 25rem, (min-width: 640px) 50vw, 100vw" />
          <CategoryLabel post={post} />
          <span className="font-heading text-lg leading-snug font-semibold tracking-[-0.01em] text-balance transition-colors duration-300 group-hover:text-brand">
            {post.title}
          </span>
          {post.excerpt && (
            <span className="line-clamp-3 text-sm leading-relaxed text-pretty text-muted-foreground">
              {post.excerpt}
            </span>
          )}
          <span className="mt-auto">
            <Details post={post} />
          </span>
        </Link>
      </BlurFade>
    </IconHoverArea>
  )
}

// Grilla de publicaciones en la retícula. Las celdas de relleno completan la última fila, para
// que no se vea el color de las líneas en los huecos.
export function PostGrid({ posts }: { posts: PostCardData[] }) {
  const fillersLg = (3 - (posts.length % 3)) % 3
  const fillerSm = posts.length % 2 === 1

  return (
    <div className={cn(GRID_CELLS_CLASS, "sm:grid-cols-2 lg:grid-cols-3")}>
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
      {fillerSm && <div aria-hidden className="hidden bg-background sm:block lg:hidden" />}
      {Array.from({ length: fillersLg }, (_, index) => (
        <div key={index} aria-hidden className="hidden bg-background lg:block" />
      ))}
    </div>
  )
}
