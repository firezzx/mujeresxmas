"use client"

import { useState, useTransition } from "react"

import { addComment, deleteComment } from "@/app/actions/blog-comments"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { TextareaField } from "@/components/forms/textarea-field"
import { useToast } from "@/components/toast/toaster"
import { COMMENT_MAX, commentSchema } from "@/lib/validations/blog"

const TOAST_ERROR = { id: "blog-comment", tone: "error", title: "Algo no salió bien" } as const

// Formulario para comentar con la cuenta de la sesión.
export function CommentForm({ postId, authorName }: { postId: string; authorName: string }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [body, setBody] = useState("")
  const [error, setError] = useState<string>()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = commentSchema.safeParse({ body })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message)
      return
    }
    startTransition(async () => {
      const result = await addComment(postId, body)
      if (!result.ok) {
        if (result.field) setError(result.message)
        else toast({ ...TOAST_ERROR, message: result.message })
        return
      }
      setBody("")
      toast({ id: "blog-comment", tone: "success", title: "Listo", message: "Publicamos tu comentario." })
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <TextareaField
        label="Tu comentario"
        placeholder="Contá qué te pareció o sumá tu experiencia."
        rows={3}
        maxLength={COMMENT_MAX}
        value={body}
        onChange={(event) => {
          setBody(event.target.value)
          setError(undefined)
        }}
        error={error}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-muted-foreground">
          Comentás como <span className="font-medium text-foreground">{authorName}</span> · {body.length}/{COMMENT_MAX}
        </p>
        <ShimmerSubmit size="md" pending={pending} pendingLabel="Publicando…" className="w-full sm:w-auto">
          Comentar
        </ShimmerSubmit>
      </div>
    </form>
  )
}

// Borrar un comentario, con confirmación en el mismo lugar.
export function CommentDelete({ id }: { id: string }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)
  const buttonClass =
    "inline-flex min-h-9 cursor-pointer items-center rounded-md px-2 text-[13px] font-medium transition-colors duration-200 disabled:cursor-wait disabled:opacity-60"

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`${buttonClass} -mx-2 text-muted-foreground hover:text-destructive`}
      >
        Eliminar
      </button>
    )
  }

  return (
    <span className="-mx-2 inline-flex flex-wrap items-center gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await deleteComment(id)
            if (!result.ok) {
              setConfirming(false)
              toast({ ...TOAST_ERROR, message: result.message })
            }
          })
        }
        className={`${buttonClass} text-destructive hover:bg-destructive/[0.06]`}
      >
        {pending ? "Eliminando…" : "Sí, eliminar"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className={`${buttonClass} text-muted-foreground hover:text-foreground`}
      >
        Cancelar
      </button>
    </span>
  )
}
