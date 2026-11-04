import Image from "next/image"

import type { PostPreview } from "@/lib/blog"
import { blogImageUrl } from "@/lib/blog-shared"
import { formatDay } from "@/lib/format"

// Una publicación armada: la usan la vista previa del panel y, más adelante, el blog público.
// El HTML lo genera el servidor al guardar, a partir del documento validado (ver savePost).
export function PostArticle({ post }: { post: PostPreview }) {
  const details = [
    post.authorName,
    post.publishedAt && formatDay(post.publishedAt),
    `${post.readingMinutes} min de lectura`,
  ].filter(Boolean)

  return (
    <article className="mx-auto w-full max-w-3xl">
      <header>
        {post.categoryName && (
          <p className="inline-flex rounded-md bg-brand-soft/60 px-2.5 py-1 text-[12px] font-medium">
            {post.categoryName}
          </p>
        )}
        <h1 className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-[2.75rem]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">{post.excerpt}</p>
        )}
        <p className="mt-4 text-[13px] text-muted-foreground">{details.join(" · ")}</p>
      </header>

      {post.coverPath && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-foreground/[0.04]">
          <Image
            src={blogImageUrl(post.coverPath)}
            alt={post.coverAlt ?? ""}
            fill
            priority
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="post-content mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}
