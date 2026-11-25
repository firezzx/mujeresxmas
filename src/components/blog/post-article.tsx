import Image from "next/image"
import Link from "next/link"

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
          className="inline-flex rounded-md bg-brand-green/15 px-3 py-1.5 font-heading text-xs font-semibold tracking-[0.08em] text-brand-green-strong uppercase transition-colors duration-200 outline-none hover:bg-brand-green/25 focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          {post.categoryName}
        </Link>
      )}
      <h1 className="mt-6 font-heading text-[2.5rem] leading-[1.02] font-semibold tracking-[-0.025em] text-balance [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground [overflow-wrap:anywhere] sm:text-xl">
          {post.excerpt}
        </p>
      )}
      <p className="mt-5 text-sm text-muted-foreground">{details.join(" · ")}</p>
    </header>
  )
}

export function PostBody({ post }: { post: PostPreview }) {
  return (
    <div className="mx-auto w-full max-w-4xl min-w-0">
      <div className="post-content" dangerouslySetInnerHTML={{ __html: post.html }} />

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
      <PostCover post={post} />
      <PostBody post={post} />
    </article>
  )
}

// Portada de la nota, como portada de revista: más ancha que el texto, con su formato original
// (banner, foto o cuadrada, sin recortes) y un resplandor de sus propios colores detrás.
export function PostCover({ post, className }: { post: PostPreview; className?: string }) {
  if (!post.coverPath) return null
  const src = blogImageUrl(post.coverPath)
  return (
    <figure className={cn("relative isolate mx-auto w-full max-w-6xl", className)}>
      <span aria-hidden className="absolute inset-x-[6%] top-[12%] -bottom-6 -z-10 opacity-60 blur-3xl saturate-150">
        <Image src={src} alt="" fill sizes="50vw" className="object-cover" />
      </span>
      <Image
        src={src}
        alt={post.coverAlt ?? ""}
        width={1600}
        height={900}
        priority
        sizes="(min-width: 1152px) 72rem, 100vw"
        className="mx-auto h-auto max-h-[38rem] w-auto max-w-full rounded-xl border-4 border-background bg-background object-contain shadow-[0_28px_56px_-24px_rgb(26_26_26/0.45)] sm:border-[6px]"
      />
    </figure>
  )
}

// Fondo de la cabecera de la nota teñido con los colores de la portada (o las luces de marca si no hay)
export function PostCoverBackdrop({ coverPath }: { coverPath: string | null }) {
  if (!coverPath) return null
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      <Image
        src={blogImageUrl(coverPath)}
        alt=""
        fill
        sizes="50vw"
        className="scale-125 object-cover opacity-40 blur-3xl saturate-150"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
    </div>
  )
}
