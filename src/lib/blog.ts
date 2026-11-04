import { connection } from "next/server"
import { cache } from "react"

import type { AdminPost, BlogCategory, EditablePost, PostCardData } from "@/lib/blog-shared"
import type { ContentStatus } from "@/lib/content-status"
import { createClient } from "@/lib/supabase/server"
import type { PostDoc } from "@/lib/validations/blog"

// Lecturas del blog (supabase/migrations/*_blog.sql): primero las del panel y al final las públicas.
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
  categorySlug: string | null
  tags: string[]
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
      "title, excerpt, content_html, reading_minutes, tags, cover_path, cover_alt, author_name, published_at, status, blog_categories (name, slug)"
    )
    .eq("id", id)
    .maybeSingle()
  if (error) console.error("[getPostPreview]", error.code, error.message)
  if (!data) return null
  const category = data.blog_categories as unknown as { name: string; slug: string } | null
  return {
    title: data.title,
    excerpt: data.excerpt,
    html: data.content_html,
    readingMinutes: data.reading_minutes,
    categoryName: category?.name ?? null,
    categorySlug: category?.slug ?? null,
    tags: data.tags,
    coverPath: data.cover_path,
    coverAlt: data.cover_alt,
    authorName: data.author_name,
    publishedAt: data.published_at,
    status: data.status,
  }
}

// ─── Blog público ────────────────────────────────────────────────────────────────────────
// Todas filtran por estado y fecha aunque la RLS ya lo haga para visitantes: una administradora
// con sesión también puede leer los borradores, y acá no tienen que aparecer.

export const POSTS_PER_PAGE = 12

const CARD_COLUMNS = "id, title, slug, excerpt, cover_path, cover_alt, reading_minutes, published_at"

type CardRow = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_path: string | null
  cover_alt: string | null
  reading_minutes: number
  published_at: string
  blog_categories: { name: string; slug: string } | null
}

const toCard = (row: CardRow): PostCardData => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  coverPath: row.cover_path,
  coverAlt: row.cover_alt,
  readingMinutes: row.reading_minutes,
  publishedAt: row.published_at,
  categoryName: row.blog_categories?.name ?? null,
  categorySlug: row.blog_categories?.slug ?? null,
})

type PublicListing = { featured: PostCardData | null; posts: PostCardData[]; total: number; totalPages: number }

// Palabras de una búsqueda, en minúsculas y sin acentos como la columna search_text. Se escapan los
// comodines de ilike para que "50%" busque ese texto.
function searchTerms(query: string) {
  return query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8)
    .map((term) => term.replace(/[\\%_]/g, "\\$&"))
}

// Una página del blog. Sin filtro ni búsqueda, arriba va la destacada más nueva (o, si no hay, la
// última publicada) y no se repite en la grilla.
export async function listPublicPosts(
  categorySlug: string | null,
  page: number,
  search: string | null = null
): Promise<PublicListing | null> {
  const supabase = await getClient()
  const now = new Date().toISOString()

  let featured: PostCardData | null = null
  if (!categorySlug && !search) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`${CARD_COLUMNS}, blog_categories (name, slug)`)
      .eq("status", "published")
      .lte("published_at", now)
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) {
      console.error("[listPublicPosts] destacada", error.code, error.message)
      return null
    }
    featured = data ? toCard(data as unknown as CardRow) : null
  }

  const start = (page - 1) * POSTS_PER_PAGE
  const category = categorySlug ? "blog_categories!inner (name, slug)" : "blog_categories (name, slug)"
  let query = supabase
    .from("blog_posts")
    .select(`${CARD_COLUMNS}, ${category}`, { count: "exact" })
    .eq("status", "published")
    .lte("published_at", now)
  if (categorySlug) query = query.eq("blog_categories.slug", categorySlug)
  if (featured) query = query.neq("id", featured.id)
  // Tienen que aparecer todas las palabras, en cualquier orden
  for (const term of searchTerms(search ?? "")) query = query.ilike("search_text", `%${term}%`)

  const { data, count, error } = await query
    .order("published_at", { ascending: false })
    .range(start, start + POSTS_PER_PAGE - 1)
  // PGRST103: se pidió una página más allá de la última (por ejemplo, un link viejo)
  if (error && error.code !== "PGRST103") {
    console.error("[listPublicPosts]", error.code, error.message)
    return null
  }

  return {
    featured,
    posts: ((data ?? []) as unknown as CardRow[]).map(toCard),
    total: count ?? 0,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / POSTS_PER_PAGE)),
  }
}

export type PublicCategory = { name: string; slug: string }

// Categorías con al menos una publicación visible, para los filtros del blog.
export async function listPublicCategories(): Promise<PublicCategory[] | null> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("blog_categories")
    .select("name, slug, blog_posts!inner (id)")
    .eq("blog_posts.status", "published")
    .lte("blog_posts.published_at", new Date().toISOString())
    .order("name")
  if (error) {
    console.error("[listPublicCategories]", error.code, error.message)
    return null
  }
  return data.map(({ name, slug }) => ({ name, slug }))
}

export type PublicPost = PostPreview & {
  id: string
  slug: string
  categoryId: string | null
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
  noindex: boolean
  updatedAt: string
}

// cache: los metadatos y la página piden la misma publicación y se hace una sola consulta.
export const getPublicPost = cache(async (slug: string): Promise<PublicPost | null> => {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, blog_categories (name, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle()
  if (error) console.error("[getPublicPost]", error.code, error.message)
  if (!data) return null
  const category = data.blog_categories as unknown as { name: string; slug: string } | null
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    html: data.content_html,
    readingMinutes: data.reading_minutes,
    categoryId: data.category_id,
    categoryName: category?.name ?? null,
    categorySlug: category?.slug ?? null,
    tags: data.tags,
    coverPath: data.cover_path,
    coverAlt: data.cover_alt,
    authorName: data.author_name,
    publishedAt: data.published_at,
    status: data.status,
    metaTitle: data.meta_title,
    metaDescription: data.meta_description,
    canonicalUrl: data.canonical_url,
    noindex: data.noindex,
    updatedAt: data.updated_at,
  }
})

// Para el final del artículo: primero las de la misma categoría y, si faltan, las últimas de las demás.
export async function listRelatedPosts(post: PublicPost, limit = 3): Promise<PostCardData[]> {
  const supabase = await getClient()
  const others = () =>
    supabase
      .from("blog_posts")
      .select(`${CARD_COLUMNS}, blog_categories (name, slug)`)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .neq("id", post.id)
      .order("published_at", { ascending: false })
      .limit(limit)

  const sameCategory = post.categoryId ? await others().eq("category_id", post.categoryId) : null
  if (sameCategory?.error) console.error("[listRelatedPosts]", sameCategory.error.code, sameCategory.error.message)
  const related = ((sameCategory?.data ?? []) as unknown as CardRow[]).map(toCard)
  if (related.length >= limit) return related

  const recent = post.categoryId ? await others().neq("category_id", post.categoryId) : await others()
  if (recent.error) console.error("[listRelatedPosts]", recent.error.code, recent.error.message)
  return [...related, ...((recent.data ?? []) as unknown as CardRow[]).map(toCard)].slice(0, limit)
}

// Publicaciones para el sitemap (sin las ocultas de los buscadores).
export async function listPostsForSitemap() {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .eq("noindex", false)
  if (error) {
    console.error("[listPostsForSitemap]", error.code, error.message)
    return []
  }
  return data.map((row) => ({ slug: row.slug as string, updatedAt: row.updated_at as string }))
}

export type PostComment = {
  id: string
  body: string
  createdAt: string
  authorName: string
  avatarUrl: string | null
  isOwn: boolean
}

type CommentRow = {
  id: string
  body: string
  created_at: string
  author_name: string | null
  avatar_path: string | null
  is_own: boolean
}

// Comentarios de una publicación, los más nuevos primero. Los perfiles son privados: la función
// de la base entrega solo el nombre visible y el avatar de quien comentó.
export async function listPostComments(postId: string): Promise<PostComment[] | null> {
  const supabase = await getClient()
  const { data, error } = await supabase.rpc("list_post_comments", { target_post: postId })
  if (error) {
    console.error("[listPostComments]", error.code, error.message)
    return null
  }
  return (data as CommentRow[]).map((row) => ({
    id: row.id,
    body: row.body,
    createdAt: row.created_at,
    authorName: row.author_name ?? "Integrante de la comunidad",
    avatarUrl: row.avatar_path ? supabase.storage.from("avatars").getPublicUrl(row.avatar_path).data.publicUrl : null,
    isOwn: row.is_own,
  }))
}
