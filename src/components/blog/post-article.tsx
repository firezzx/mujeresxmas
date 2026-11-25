import Image from "next/image"
import Link from "next/link"

import { BlogCover } from "@/components/blog/blog-cover"
import { PAGE_WIDTH_CLASS } from "@/components/page-band"
import { ROUTES } from "@/config/navigation"
import type { PostPreview } from "@/lib/blog"
import { blogImageUrl, type PostCardData } from "@/lib/blog-shared"
import { formatDay } from "@/lib/format"
import { cn } from "@/lib/utils"

// Una publicación armada como nota de revista: título grande, portada a todo el ancho con su
// epígrafe y el texto con una columna de más notas. La usan la vista previa del panel y el blog.
// El HTML lo genera el servidor al guardar, a partir del documento validado (ver savePost).

export function PostHeader({ post, className }: { post: PostPreview; className?: string }) {
  const details = [post.authorName, `${post.readingMinutes} min de lectura`].filter(Boolean)

  return (
    <header className={cn("w-full max-w-4xl min-w-0", className)}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-xs font-semibold tracking-[0.14em] uppercase">
        {post.categoryName && post.categorySlug && (
          <Link
            href={`${ROUTES.blog}?categoria=${post.categorySlug}`}
            className="rounded-sm text-brand-green-strong underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            {post.categoryName}
          </Link>
        )}
        {post.categoryName && post.publishedAt && <span aria-hidden className="size-1 rounded-full bg-brand" />}
        {post.publishedAt && <span className="text-muted-foreground">{formatDay(post.publishedAt)}</span>}
      </p>
      <h1 className="mt-5 font-heading text-[2rem] leading-[1.05] font-semibold tracking-[-0.025em] text-balance [overflow-wrap:anywhere] min-[420px]:text-[2.5rem] sm:text-6xl lg:text-7xl">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-muted-foreground [overflow-wrap:anywhere] sm:text-xl">
          {post.excerpt}
        </p>
      )}
      <p className="mt-6 text-sm text-muted-foreground">{details.join(" · ")}</p>
    </header>
  )
}

// Portada a todo el ancho de la pantalla, como banner, con la proporción de la imagen: un banner
// ancho se ve entero de lado a lado. Si la imagen es alta, se limita la altura y los costados los
// rellena la misma imagen difuminada. El texto alternativo va como epígrafe si no repite el título.
export function PostBanner({ post, className }: { post: PostPreview; className?: string }) {
  if (!post.coverPath) return null
  const src = blogImageUrl(post.coverPath)
  const caption = post.coverAlt && post.coverAlt.trim().toLowerCase() !== post.title.trim().toLowerCase()
  return (
    <figure className={cn("w-full", className)}>
      <div className="relative isolate overflow-hidden bg-foreground/[0.04]">
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          sizes="50vw"
          className="-z-10 scale-125 object-cover opacity-70 blur-3xl saturate-150"
        />
        <Image
          src={src}
          alt={post.coverAlt ?? ""}
          width={2400}
          height={1000}
          priority
          sizes="100vw"
          className="mx-auto h-auto max-h-[38rem] w-full object-contain"
        />
      </div>
      {caption && (
        <figcaption className={cn(PAGE_WIDTH_CLASS, "mt-3 text-sm text-muted-foreground italic")}>
          {post.coverAlt}
        </figcaption>
      )}
    </figure>
  )
}

export function PostBody({ post, className }: { post: PostPreview; className?: string }) {
  return (
    <div className={cn("w-full max-w-3xl min-w-0", className)}>
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

// Columna "Más notas" al costado del texto (abajo en el celular)
export function RelatedPosts({ posts, className }: { posts: PostCardData[]; className?: string }) {
  if (posts.length === 0) return null
  return (
    <aside aria-labelledby="mas-notas" className={cn("min-w-0", className)}>
      <p id="mas-notas" className="font-heading text-sm font-semibold tracking-[0.14em] uppercase">
        Más notas
      </p>
      <ul className="mt-5 flex flex-col gap-5">
        {posts.map((related) => (
          <li key={related.id}>
            <Link
              href={`${ROUTES.blog}/${related.slug}`}
              className="group flex items-start gap-4 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              {related.coverPath ? (
                <BlogCover
                  path={related.coverPath}
                  alt=""
                  sizes="7rem"
                  zoomOnHover
                  className="aspect-[4/3] w-28 shrink-0 rounded-lg"
                />
              ) : (
                <span aria-hidden className="aspect-[4/3] w-28 shrink-0 rounded-lg bg-brand-soft/40" />
              )}
              <span className="flex min-w-0 flex-col gap-1">
                <span className="line-clamp-3 font-heading text-[15px] leading-snug font-semibold text-balance transition-colors duration-300 group-hover:text-brand-green-strong">
                  {related.title}
                </span>
                <span className="text-xs text-muted-foreground">{formatDay(related.publishedAt)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

// Vista previa del panel: la misma nota, dentro del ancho del panel
export function PostArticle({ post }: { post: PostPreview }) {
  return (
    <article className="flex flex-col gap-8">
      <PostHeader post={post} />
      {post.coverPath && (
        <BlogCover
          path={post.coverPath}
          alt={post.coverAlt}
          sizes="(min-width: 1024px) 60rem, 100vw"
          className="aspect-[21/9] w-full rounded-xl"
        />
      )}
      <PostBody post={post} />
    </article>
  )
}
