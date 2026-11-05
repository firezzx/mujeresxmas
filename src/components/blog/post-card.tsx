import Image from "next/image"
import Link from "next/link"

import { BrandCard } from "@/components/account/account-card"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import { blogImageUrl, type PostCardData } from "@/lib/blog-shared"
import { formatDay } from "@/lib/format"

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

const CARD_LINK_CLASS =
  "group block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"

// La publicación principal del blog, a todo el ancho.
export function FeaturedPostCard({ post }: { post: PostCardData }) {
  return (
    <IconHoverArea>
      <BlurFade inView>
        <Link href={postHref(post.slug)} className={CARD_LINK_CLASS}>
          <BrandCard contentClassName="flex flex-col gap-6 p-3 sm:p-4 md:grid md:grid-cols-2 md:items-center md:gap-10">
            <Cover post={post} index={0} sizes="(min-width: 768px) 50vw, 100vw" priority />
            <span className="flex min-w-0 flex-col items-start gap-4 px-2 pb-3 md:pb-0">
              <CategoryLabel post={post} />
              <span className="font-heading text-2xl leading-tight font-semibold tracking-[-0.01em] text-balance [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-brand-green-strong sm:text-4xl lg:text-5xl">
                {post.title}
              </span>
              {post.excerpt && (
                <span className="text-[15px] leading-relaxed text-pretty [overflow-wrap:anywhere] text-muted-foreground sm:text-base">
                  {post.excerpt}
                </span>
              )}
              <Details post={post} />
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
            <Cover post={post} index={index + 1} sizes="(min-width: 1024px) 29rem, (min-width: 640px) 50vw, 100vw" />
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
