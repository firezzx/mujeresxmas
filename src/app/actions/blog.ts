"use server"

import type { JSONContent } from "@tiptap/core"
import { renderToHTMLString } from "@tiptap/static-renderer/pm/html-string"
import { refresh } from "next/cache"
import { z } from "zod"

import { getAdminView } from "@/lib/admin"
import { POST_EXTENSIONS } from "@/lib/blog-extensions"
import { BLOG_BUCKET, type BlogCategory, docImagePaths } from "@/lib/blog-shared"
import { createClient } from "@/lib/supabase/server"
import {
  type CategoryField,
  type CategoryInput,
  categorySchema,
  countWords,
  type PostField,
  type PostInput,
  postSchema,
  readingMinutes,
} from "@/lib/validations/blog"

const UNIQUE_VIOLATION = "23505"
const FOREIGN_KEY_VIOLATION = "23503"

const NOT_ADMIN = "Solo las administradoras pueden gestionar el blog."

export type SavePostResult =
  | { status: "saved"; id: string; publishedAt: string | null }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<PostField, string[]>> }

// Crea o actualiza una publicación. El HTML se genera acá, a partir del documento validado, y
// nunca llega armado desde el navegador. Solo administradoras (también lo exige la RLS).
export async function savePost(id: string | null, input: PostInput): Promise<SavePostResult> {
  if ((await getAdminView()) !== "admin") return { status: "error", message: NOT_ADMIN }
  if (id !== null && !z.uuid().safeParse(id).success) return { status: "error", message: "Publicación no válida." }

  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  const post = parsed.data

  let html: string
  try {
    html = renderToHTMLString({ extensions: POST_EXTENSIONS, content: post.content as JSONContent })
  } catch (error) {
    console.error("[savePost] contenido", error)
    return { status: "error", fieldErrors: { content: ["El contenido tiene un formato que no reconocemos."] } }
  }

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  const publishedAt = post.status === "published" ? (post.publishedAt ?? new Date().toISOString()) : post.publishedAt

  const row = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || null,
    content: post.content,
    content_html: html,
    reading_minutes: readingMinutes(countWords(post.content)),
    category_id: post.categoryId,
    tags: [...new Set(post.tags)],
    cover_path: post.coverPath,
    cover_alt: post.coverAlt || null,
    author_name: post.authorName || null,
    featured: post.featured,
    status: post.status,
    published_at: publishedAt,
    meta_title: post.metaTitle || null,
    meta_description: post.metaDescription || null,
    canonical_url: post.canonicalUrl || null,
    noindex: post.noindex,
  }

  // Para borrar después la portada y las imágenes que se quitaron
  const previous = id
    ? (await supabase.from("blog_posts").select("cover_path, content").eq("id", id).maybeSingle()).data
    : null

  const { data, error } = id
    ? await supabase.from("blog_posts").update(row).eq("id", id).select("id").maybeSingle()
    : await supabase
        .from("blog_posts")
        .insert({ ...row, created_by: claims?.claims?.sub ?? null })
        .select("id")
        .maybeSingle()

  if (error?.code === UNIQUE_VIOLATION) {
    return { status: "error", fieldErrors: { slug: ["Ya hay otra publicación con esta dirección."] } }
  }
  if (error || !data) {
    if (error) console.error("[savePost]", error.code, error.message)
    return { status: "error", message: "No pudimos guardar la publicación. Volvé a intentar." }
  }

  if (previous) {
    const current = new Set([post.coverPath, ...docImagePaths(post.content)])
    const removed = [previous.cover_path, ...docImagePaths(previous.content)].filter(
      (path): path is string => Boolean(path) && !current.has(path)
    )
    if (removed.length) await supabase.storage.from(BLOG_BUCKET).remove(removed)
  }

  refresh()
  return { status: "saved", id: data.id, publishedAt }
}

export type DeleteResult = { ok: true } | { ok: false; message: string }

// Borra la publicación y sus imágenes.
export async function deletePost(id: string): Promise<DeleteResult> {
  if ((await getAdminView()) !== "admin") return { ok: false, message: NOT_ADMIN }
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Publicación no válida." }

  const supabase = await createClient()
  const { data: post } = await supabase.from("blog_posts").select("cover_path, content").eq("id", id).maybeSingle()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) {
    console.error("[deletePost]", error.code, error.message)
    return { ok: false, message: "No pudimos borrar la publicación. Volvé a intentar." }
  }

  const images = [...(post?.cover_path ? [post.cover_path] : []), ...docImagePaths(post?.content)]
  if (images.length) await supabase.storage.from(BLOG_BUCKET).remove(images)

  refresh()
  return { ok: true }
}

export type SaveCategoryResult =
  | { status: "saved"; category: BlogCategory }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<CategoryField, string[]>> }

// Crea o actualiza una categoría.
export async function saveCategory(id: string | null, input: CategoryInput): Promise<SaveCategoryResult> {
  if ((await getAdminView()) !== "admin") return { status: "error", message: NOT_ADMIN }
  if (id !== null && !z.uuid().safeParse(id).success) return { status: "error", message: "Categoría no válida." }

  const parsed = categorySchema.safeParse(input)
  if (!parsed.success) return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  const row = { ...parsed.data, description: parsed.data.description || null }

  const supabase = await createClient()
  const { data, error } = id
    ? await supabase
        .from("blog_categories")
        .update(row)
        .eq("id", id)
        .select("id, name, slug, description")
        .maybeSingle()
    : await supabase.from("blog_categories").insert(row).select("id, name, slug, description").maybeSingle()

  if (error?.code === UNIQUE_VIOLATION) {
    return { status: "error", fieldErrors: { slug: ["Ya hay otra categoría con esta dirección."] } }
  }
  if (error || !data) {
    if (error) console.error("[saveCategory]", error.code, error.message)
    return { status: "error", message: "No pudimos guardar la categoría. Volvé a intentar." }
  }

  refresh()
  return { status: "saved", category: { ...data, postCount: 0 } }
}

// Borra una categoría sin publicaciones (las que tienen las protege la base de datos).
export async function deleteCategory(id: string): Promise<DeleteResult> {
  if ((await getAdminView()) !== "admin") return { ok: false, message: NOT_ADMIN }
  if (!z.uuid().safeParse(id).success) return { ok: false, message: "Categoría no válida." }

  const supabase = await createClient()
  const { error } = await supabase.from("blog_categories").delete().eq("id", id)
  if (error?.code === FOREIGN_KEY_VIOLATION) {
    return { ok: false, message: "Esta categoría tiene publicaciones: primero movelas a otra." }
  }
  if (error) {
    console.error("[deleteCategory]", error.code, error.message)
    return { ok: false, message: "No pudimos borrar la categoría. Volvé a intentar." }
  }

  refresh()
  return { ok: true }
}
