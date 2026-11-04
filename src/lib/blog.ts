import { connection } from "next/server"

import type { AdminPost, BlogCategory, EditablePost } from "@/lib/blog-shared"
import type { ContentStatus } from "@/lib/content-status"
import { createClient } from "@/lib/supabase/server"
import type { PostDoc } from "@/lib/validations/blog"

// Lecturas del panel del blog (supabase/migrations/*_blog.sql).
// Para sumar un campo: columna en la migración, una línea en el tipo y en el select.

// Supabase compara el vencimiento del token con la hora actual: solo puede pasar en el pedido
// real, no en el prerender
async function getClient() {
  await connection()
  return createClient()
}

export async function listBlogCategories(): Promise<BlogCategory[] | null> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("blog_categories")
    .select("id, name, slug, description, blog_posts (count)")
    .order("name")
  if (error) {
    console.error("[listBlogCategories]", error.code, error.message)
    return null
  }
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    postCount: (row.blog_posts as unknown as { count: number }[])[0]?.count ?? 0,
  }))
}

type PostListRow = {
  id: string
  title: string
  slug: string
  category_id: string | null
  cover_path: string | null
  cover_alt: string | null
  featured: boolean
  status: ContentStatus
  published_at: string | null
  updated_at: string
  blog_categories: { name: string } | null
}

export async function listPostsForAdmin(): Promise<AdminPost[] | null> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, category_id, cover_path, cover_alt, featured, status, published_at, updated_at, blog_categories (name)"
    )
    .order("updated_at", { ascending: false })
  if (error) {
    console.error("[listPostsForAdmin]", error.code, error.message)
    return null
  }
  return (data as unknown as PostListRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    categoryId: row.category_id,
    categoryName: row.blog_categories?.name ?? null,
    coverPath: row.cover_path,
    coverAlt: row.cover_alt,
    featured: row.featured,
    status: row.status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  }))
}

export async function getPostForAdmin(id: string): Promise<EditablePost | null> {
  const supabase = await getClient()
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle()
  if (error) console.error("[getPostForAdmin]", error.code, error.message)
  if (!data) return null
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt ?? "",
    content: data.content as PostDoc,
    categoryId: data.category_id,
    tags: data.tags,
    coverPath: data.cover_path,
    coverAlt: data.cover_alt ?? "",
    authorName: data.author_name ?? "",
    featured: data.featured,
    status: data.status,
    publishedAt: data.published_at,
    metaTitle: data.meta_title ?? "",
    metaDescription: data.meta_description ?? "",
    canonicalUrl: data.canonical_url ?? "",
    noindex: data.noindex,
  }
}

export type PostPreview = {
  title: string
  excerpt: string | null
  html: string
  readingMinutes: number
  categoryName: string | null
  coverPath: string | null
  coverAlt: string | null
  authorName: string | null
  publishedAt: string | null
  status: ContentStatus
}

// Lo que necesita PostArticle para mostrar una publicación tal como quedó guardada.
export async function getPostPreview(id: string): Promise<PostPreview | null> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "title, excerpt, content_html, reading_minutes, cover_path, cover_alt, author_name, published_at, status, blog_categories (name)"
    )
    .eq("id", id)
    .maybeSingle()
  if (error) console.error("[getPostPreview]", error.code, error.message)
  if (!data) return null
  const category = data.blog_categories as unknown as { name: string } | null
  return {
    title: data.title,
    excerpt: data.excerpt,
    html: data.content_html,
    readingMinutes: data.reading_minutes,
    categoryName: category?.name ?? null,
    coverPath: data.cover_path,
    coverAlt: data.cover_alt,
    authorName: data.author_name,
    publishedAt: data.published_at,
    status: data.status,
  }
}
