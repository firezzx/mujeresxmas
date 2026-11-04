import Link from "next/link"

import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { CommentDelete, CommentForm } from "@/components/blog/comment-controls"
import { pillLinkVariants } from "@/components/pill-link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ROUTES } from "@/config/navigation"
import { getAdminView } from "@/lib/admin"
import { listPostComments, type PostComment } from "@/lib/blog"
import { formatDay } from "@/lib/format"
import { getCurrentUser } from "@/lib/supabase/user"

const WIDTH_CLASS = "mx-auto w-full max-w-3xl min-w-0"

// Comentarios de una publicación: lee los datos y la sesión, y los entrega a la vista.
export async function PostComments({ postId, slug }: { postId: string; slug: string }) {
  const [comments, user, adminView] = await Promise.all([listPostComments(postId), getCurrentUser(), getAdminView()])

  if (!comments) {
    return (
      <section aria-label="Comentarios" className={WIDTH_CLASS}>
        <p className="rounded-lg bg-destructive/[0.06] px-4 py-5 text-sm text-destructive">
          No pudimos cargar los comentarios. Volvé a intentar en un rato.
        </p>
      </section>
    )
  }

  const authorName = user
    ? [user.firstName, user.lastName?.trim().charAt(0) && `${user.lastName.trim().charAt(0)}.`]
        .filter(Boolean)
        .join(" ") || "Integrante de la comunidad"
    : null

  return (
    <PostCommentsView
      postId={postId}
      returnTo={`${ROUTES.blog}/${slug}`}
      comments={comments}
      authorName={authorName}
      canModerate={adminView === "admin"}
    />
  )
}

type PostCommentsViewProps = {
  postId: string
  // A dónde volver después de ingresar o registrarse
  returnTo: string
  comments: PostComment[]
  // Nombre visible de la sesión; null para visitantes
  authorName: string | null
  canModerate: boolean
}

export function PostCommentsView({ postId, returnTo, comments, authorName, canModerate }: PostCommentsViewProps) {
  return (
    <section aria-labelledby="comentarios" id="comentarios-seccion" className={`${WIDTH_CLASS} scroll-mt-24`}>
      <h2 id="comentarios" className="font-heading text-xl font-semibold tracking-[-0.01em] sm:text-2xl">
        Comentarios{comments.length > 0 && <span className="text-muted-foreground"> ({comments.length})</span>}
      </h2>

      <div className="mt-6">
        {authorName ? <CommentForm postId={postId} authorName={authorName} /> : <GuestPrompt returnTo={returnTo} />}
      </div>

      {comments.length > 0 ? (
        <ul className="mt-8 divide-y divide-border/70 border-t border-border/70">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} canDelete={comment.isOwn || canModerate} />
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Todavía no hay comentarios. Podés escribir el primero.</p>
      )}
    </section>
  )
}

function GuestPrompt({ returnTo }: { returnTo: string }) {
  const next = `?next=${encodeURIComponent(returnTo)}`
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[15px] leading-relaxed text-pretty">Para comentar necesitás tu cuenta de Mujeres x Más.</p>
      <div className="flex flex-col gap-2 min-[400px]:flex-row sm:shrink-0">
        <Link
          href={`${ROUTES.registro}${next}`}
          className={pillLinkVariants({ variant: "outline", className: "h-11 rounded-lg" })}
        >
          Crear cuenta
        </Link>
        <ShimmerLink href={`${ROUTES.login}${next}`} size="md">
          Ingresar
        </ShimmerLink>
      </div>
    </div>
  )
}

function CommentItem({ comment, canDelete }: { comment: PostComment; canDelete: boolean }) {
  return (
    <li className="flex gap-3 py-5 sm:gap-4">
      <Avatar className="size-9 shrink-0 sm:size-10">
        {comment.avatarUrl && <AvatarImage src={comment.avatarUrl} alt="" />}
        <AvatarFallback className="bg-brand-soft/60 text-[13px] font-medium text-foreground">
          {comment.authorName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
          <span className="text-sm font-medium [overflow-wrap:anywhere]">{comment.authorName}</span>
          <span className="text-muted-foreground">{formatDay(comment.createdAt)}</span>
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed whitespace-pre-line [overflow-wrap:anywhere]">
          {comment.body}
        </p>
        {canDelete && (
          <div className="mt-1">
            <CommentDelete id={comment.id} />
          </div>
        )}
      </div>
    </li>
  )
}

export function PostCommentsSkeleton() {
  return (
    <div aria-hidden className={`${WIDTH_CLASS} flex flex-col gap-5`}>
      <div className="h-7 w-40 animate-pulse rounded-md bg-foreground/[0.06]" />
      <div className="h-28 animate-pulse rounded-lg bg-foreground/[0.04]" />
    </div>
  )
}
