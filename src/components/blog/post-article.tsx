import Image from "next/image"
import Link from "next/link"

import { PHOTO_FRAME_CLASS } from "@/components/page-band"
import { ROUTES } from "@/config/navigation"
import type { PostPreview } from "@/lib/blog"
import { blogImageUrl } from "@/lib/blog-shared"
import { formatDay } from "@/lib/format"
import { cn } from "@/lib/utils"

// Una publicación armada: la usan la vista previa del panel y el blog público.
// El HTML lo genera el servidor al guardar, a partir del documento validado (ver savePost).
export function PostHeader({ post }: { post: PostPreview }) {
  const details = [
    post.authorName,
    post.publishedAt && formatDay(post.publishedAt),
    `${post.readingMinutes} min de lectura`,
  ].filter(Boolean)

  return (
    <header className="mx-auto w-full max-w-4xl min-w-0">
      {post.categoryName && post.categorySlug && (
        <Link
          href={`${ROUTES.blog}?categoria=${post.categorySlug}`}
          className="inline-flex rounded-md bg-background px-2.5 py-2 text-[13px] font-medium ring-1 ring-foreground/10 transition-colors duration-200 outline-none hover:bg-brand-soft/60 focus-visible:ring-3 focus-visible:ring-ring/40 sm:py-1"
        >
          {post.categoryName}
        </Link>
      )}
      <h1 className="mt-4 font-heading text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance [overflow-wrap:anywhere] sm:text-6xl">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="mt-4 text-lg leading-relaxed text-pretty [overflow-wrap:anywhere] sm:text-xl">
          {post.excerpt}
        </p>
      )}
      <p className="mt-4 text-sm">{details.join(" · ")}</p>
    </header>
  )
}

export function PostBody({ post }: { post: PostPreview }) {
  return (
    <div className="mx-auto w-full max-w-4xl min-w-0">
      {post.coverPath && (
        <div className={cn(PHOTO_FRAME_CLASS, "aspect-[16/9] bg-foreground/[0.04]")}>
          <Image
            src={blogImageUrl(post.coverPath)}
            alt={post.coverAlt ?? ""}
            fill
            priority
            sizes="(min-width: 896px) 56rem, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="post-content mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

      {post.tags.length > 0 && (
        <ul aria-label="Etiquetas" className="mt-10 flex flex-wrap gap-1.5 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="max-w-full rounded-md px-2.5 py-1 text-[13px] [overflow-wrap:anywhere] text-muted-foreground ring-1 ring-border"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function PostArticle({ post }: { post: PostPreview }) {
  return (
    <article className="flex flex-col gap-8">
      <PostHeader post={post} />
      <PostBody post={post} />
    </article>
  )
}
