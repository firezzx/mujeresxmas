"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { commentSchema } from "@/lib/validations/blog"

const RATE_LIMIT_ERROR = "P0001"

export type CommentResult = { ok: true } | { ok: false; message: string; field?: boolean }

// Publica un comentario con la cuenta de la sesión: el autor nunca viene del navegador.
export async function addComment(postId: string, body: string): Promise<CommentResult> {
  if (!z.uuid().safeParse(postId).success) return { ok: false, message: "Publicación no válida." }

  const parsed = commentSchema.safeParse({ body })
  if (!parsed.success) {
    return { ok: false, field: true, message: z.flattenError(parsed.error).fieldErrors.body?.[0] ?? "Revisá el texto." }
  }

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return { ok: false, message: "Tu sesión venció. Volvé a ingresar para comentar." }

  const { error } = await supabase
    .from("blog_comments")
    .insert({ post_id: postId, user_id: userId, body: parsed.data.body })
  if (error?.code === RATE_LIMIT_ERROR) {
    return { ok: false, message: "Esperá unos segundos antes de volver a comentar." }
  }
  if (error) {
    console.error("[addComment]", error.code, error.message)
    return { ok: false, message: "No pudimos publicar tu comentario. Volvé a intentar." }
  }

  refresh()
  return { ok: true }
}

// Borra un comentario. La RLS solo lo permite a quien lo escribió y a las administradoras.
export async function deleteComment(id: string): Promise<CommentResult> {
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Comentario no válido." }

  const supabase = await createClient()
  const { data, error } = await supabase.from("blog_comments").delete().eq("id", id).select("id")
  if (error || !data?.length) {
    if (error) console.error("[deleteComment]", error.code, error.message)
    return { ok: false, message: "No pudimos borrar el comentario. Volvé a intentar." }
  }

  refresh()
  return { ok: true }
}
