import { z } from "zod"

// Publicaciones y categorías del blog. Los límites coinciden con los check de las tablas.

export const POST_LIMITS = {
  title: 160,
  slug: 120,
  excerpt: 300,
  coverAlt: 160,
  authorName: 80,
  metaTitle: 70,
  metaDescription: 160,
  tags: 10,
  tag: 30,
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const SLUG_MESSAGE = "Usá solo minúsculas, números y guiones"

// "¿Cómo vender más?" → "como-vender-mas"
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export type PostDoc = { type: "doc"; content?: unknown[] }

type DocNode = { text?: unknown; content?: unknown }

// Texto plano de un documento del editor, para contar palabras y saber si está vacío.
export function docText(node: DocNode): string {
  if (typeof node.text === "string") return node.text
  if (!Array.isArray(node.content)) return ""
  return node.content.map((child) => docText(child as DocNode)).join(" ")
}

export const countWords = (doc: PostDoc) => docText(doc).trim().split(/\s+/).filter(Boolean).length

// Unas 200 palabras por minuto, como mínimo 1 minuto
export const readingMinutes = (words: number) => Math.max(1, Math.round(words / 200))

export const POST_STATUSES = ["draft", "published", "archived"] as const

export const postSchema = z
  .object({
    title: z.string().trim().min(1, "Escribí un título").max(POST_LIMITS.title, "Título: hasta 160 caracteres"),
    slug: z
      .string()
      .trim()
      .min(1, "Escribí la dirección de la publicación")
      .max(POST_LIMITS.slug, "Dirección: hasta 120 caracteres")
      .regex(SLUG_PATTERN, SLUG_MESSAGE),
    excerpt: z.string().trim().max(POST_LIMITS.excerpt, "Bajada: hasta 300 caracteres"),
    content: z.object({ type: z.literal("doc"), content: z.array(z.unknown()).optional() }),
    categoryId: z.uuid().nullable(),
    tags: z
      .array(z.string().trim().min(1).max(POST_LIMITS.tag, "Cada etiqueta: hasta 30 caracteres"))
      .max(POST_LIMITS.tags, "Hasta 10 etiquetas"),
    coverPath: z.string().nullable(),
    coverAlt: z.string().trim().max(POST_LIMITS.coverAlt, "Descripción: hasta 160 caracteres"),
    authorName: z.string().trim().max(POST_LIMITS.authorName, "Autoría: hasta 80 caracteres"),
    featured: z.boolean(),
    status: z.enum(POST_STATUSES),
    publishedAt: z.iso.datetime({ offset: true }).nullable(),
    metaTitle: z.string().trim().max(POST_LIMITS.metaTitle, "Título SEO: hasta 70 caracteres"),
    metaDescription: z.string().trim().max(POST_LIMITS.metaDescription, "Descripción SEO: hasta 160 caracteres"),
    canonicalUrl: z
      .string()
      .trim()
      .refine((value) => value === "" || /^https:\/\/[^\s]+$/.test(value), "La URL tiene que empezar con https://"),
    noindex: z.boolean(),
  })
  // Un borrador puede estar incompleto; para publicar hacen falta estos datos
  .superRefine((post, ctx) => {
    if (post.coverPath && !post.coverAlt) {
      ctx.addIssue({ code: "custom", path: ["coverAlt"], message: "Describí la imagen para quien no pueda verla" })
    }
    if (post.status !== "published") return
    if (!post.excerpt) ctx.addIssue({ code: "custom", path: ["excerpt"], message: "Escribí la bajada para publicar" })
    if (!post.categoryId) ctx.addIssue({ code: "custom", path: ["categoryId"], message: "Elegí una categoría" })
    if (!countWords(post.content)) {
      ctx.addIssue({ code: "custom", path: ["content"], message: "Escribí el contenido para publicar" })
    }
  })

export type PostInput = z.input<typeof postSchema>
export type PostField = keyof PostInput

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Escribí un nombre").max(60, "Nombre: hasta 60 caracteres"),
  slug: z
    .string()
    .trim()
    .min(1, "Escribí la dirección de la categoría")
    .max(80, "Dirección: hasta 80 caracteres")
    .regex(SLUG_PATTERN, SLUG_MESSAGE),
  description: z.string().trim().max(200, "Descripción: hasta 200 caracteres"),
})

export type CategoryInput = z.input<typeof categorySchema>
export type CategoryField = keyof CategoryInput
