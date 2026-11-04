"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import { AdminEmpty, AdminList } from "@/components/admin/admin-ui"
import { PostStatusBadge } from "@/components/admin/blog/post-status-badge"
import { SelectField } from "@/components/forms/select-field"
import { TextField } from "@/components/forms/text-field"
import { HoverIcon } from "@/components/icons/hover-icon"
import { ROUTES } from "@/config/navigation"
import {
  type AdminPost,
  type BlogCategory,
  blogImageUrl,
  POST_STATUS_LABELS,
  type PostDisplayStatus,
  postDisplayStatus,
} from "@/lib/blog-shared"
import { formatShortDate } from "@/lib/format"

const STATUSES = Object.keys(POST_STATUS_LABELS) as PostDisplayStatus[]

// Sin distinguir acentos ni mayúsculas
const normalize = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

// Lista de publicaciones del panel, con buscador y filtros por categoría y estado.
export function PostList({ posts, categories }: { posts: AdminPost[]; categories: BlogCategory[] }) {
  const [query, setQuery] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [status, setStatus] = useState("")

  const visible = useMemo(() => {
    const term = normalize(query.trim())
    return posts.filter(
      (post) =>
        (!term || normalize(post.title).includes(term)) &&
        (!categoryId || post.categoryId === categoryId) &&
        (!status || postDisplayStatus(post.status, post.publishedAt) === status)
    )
  }, [posts, query, categoryId, status])

  if (!posts.length) {
    return (
      <AdminEmpty
        icon="file-text"
        tone="green"
        title="Todavía no hay publicaciones"
        text="Creá la primera con el botón Nueva publicación. Podés guardarla como borrador hasta que esté lista."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem_11rem]">
        <TextField
          label="Buscar"
          type="search"
          placeholder="Título de la publicación"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          trailing={<HoverIcon name="search" size={16} className="mr-2.5 text-muted-foreground" />}
        />
        <SelectField label="Categoría" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
        <SelectField label="Estado" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos</option>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {POST_STATUS_LABELS[item]}
            </option>
          ))}
        </SelectField>
      </div>

      {visible.length ? (
        <AdminList>
          {visible.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </AdminList>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          Ninguna publicación coincide con esta búsqueda.
        </p>
      )}
    </div>
  )
}

function PostRow({ post }: { post: AdminPost }) {
  const displayStatus = postDisplayStatus(post.status, post.publishedAt)
  const date = post.status === "published" && post.publishedAt ? post.publishedAt : post.updatedAt

  return (
    <li className="py-3 first:pt-0 last:pb-0">
      <Link
        href={`${ROUTES.adminBlog}/${post.id}`}
        className="group flex items-center gap-4 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <span className="relative hidden aspect-[16/10] w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-foreground/[0.04] text-foreground/30 min-[420px]:flex">
          {post.coverPath ? (
            <Image
              src={blogImageUrl(post.coverPath)}
              alt={post.coverAlt ?? ""}
              fill
              sizes="6rem"
              className="object-cover"
            />
          ) : (
            <HoverIcon name="file-text" size={20} />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium transition-colors duration-200 group-hover:text-brand">
            {post.title}
          </span>
          <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
            <span>{post.categoryName ?? "Sin categoría"}</span>
            <span aria-hidden>·</span>
            <span>{formatShortDate(date)}</span>
            {post.featured && (
              <span className="rounded-md bg-brand/12 px-2 py-0.5 text-[11px] font-medium text-foreground">
                Destacada
              </span>
            )}
          </span>
        </span>
        <PostStatusBadge status={displayStatus} />
      </Link>
    </li>
  )
}
