import { ROUTES } from "@/config/navigation"
import type { ContentStatus } from "@/lib/content-status"
import type { PostDoc } from "@/lib/validations/blog"

// Tipos y ayudas del blog que se usan tanto en el servidor como en el navegador.

export const BLOG_BUCKET = "blog"

export const SEARCH_MAX = 80

// Dirección del listado del blog con su categoría, búsqueda y página.
export function blogHref({
  category,
  query,
  page,
}: {
  category?: string | null
  query?: string | null
  page?: number
}) {
  const params = new URLSearchParams()
  if (category) params.set("categoria", category)
  if (query) params.set("q", query)
  if (page && page > 1) params.set("pagina", String(page))
  const search = params.toString()
  return search ? `${ROUTES.blog}?${search}` : ROUTES.blog
}

export type BlogCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  postCount: number
}

export type AdminPost = {
  id: string
  title: string
  slug: string
  categoryId: string | null
  categoryName: string | null
  coverPath: string | null
  coverAlt: string | null
  featured: boolean
  status: ContentStatus
  publishedAt: string | null
  updatedAt: string
}

export type EditablePost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: PostDoc
  categoryId: string | null
  tags: string[]
  coverPath: string | null
  coverAlt: string
  authorName: string
  featured: boolean
  status: ContentStatus
  publishedAt: string | null
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  noindex: boolean
}

export type PostCardData = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverPath: string | null
  coverAlt: string | null
  readingMinutes: number
  publishedAt: string
  categoryName: string | null
  categorySlug: string | null
}

export type PostDisplayStatus = ContentStatus | "scheduled"

export const POST_STATUS_LABELS: Record<PostDisplayStatus, string> = {
  draft: "Borrador",
  scheduled: "Programada",
  published: "Publicada",
  archived: "Archivada",
}

// Una publicación con fecha futura está programada: se ve sola cuando llega el momento.
export function postDisplayStatus(status: ContentStatus, publishedAt: string | null): PostDisplayStatus {
  if (status === "published" && isFutureDate(publishedAt)) return "scheduled"
  return status
}

// La fecha de publicación se carga en hora de Argentina (sin horario de verano), igual que
// se muestran todas las fechas del sitio. "YYYY-MM-DDTHH:mm" es el formato de datetime-local.
const ARGENTINA_OFFSET_MS = 3 * 60 * 60 * 1000

export const toArgentinaInput = (iso: string | null) =>
  iso ? new Date(new Date(iso).getTime() - ARGENTINA_OFFSET_MS).toISOString().slice(0, 16) : ""

export const fromArgentinaInput = (local: string) => (local ? new Date(`${local}:00-03:00`).toISOString() : null)

export const isFutureDate = (iso: string | null) => Boolean(iso) && new Date(iso as string).getTime() > Date.now()

// Las rutas que empiezan con "/" son fotos del propio sitio (las usan los datos de prueba); el resto está en el bucket.
export const isSiteImage = (path: string) => path.startsWith("/")

export const blogImageUrl = (path: string) =>
  isSiteImage(path) ? path : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BLOG_BUCKET}/${path}`

const BLOG_IMAGE_MARKER = `/object/public/${BLOG_BUCKET}/`

// Rutas en el bucket de las imágenes insertadas en el contenido, para borrarlas con la publicación.
export function docImagePaths(node: unknown): string[] {
  if (!node || typeof node !== "object") return []
  const { type, attrs, content } = node as { type?: string; attrs?: { src?: unknown }; content?: unknown }
  const own =
    type === "image" && typeof attrs?.src === "string" && attrs.src.includes(BLOG_IMAGE_MARKER)
      ? [attrs.src.split(BLOG_IMAGE_MARKER)[1]]
      : []
  return Array.isArray(content) ? [...own, ...content.flatMap(docImagePaths)] : own
}
