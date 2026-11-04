"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useRef, useState, useTransition } from "react"
import { z } from "zod"

import { deletePost, saveCategory, savePost } from "@/app/actions/blog"
import { PostStatusBadge } from "@/components/admin/blog/post-status-badge"
import { RichEditor } from "@/components/admin/blog/rich-editor"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { SelectField } from "@/components/forms/select-field"
import { TextField } from "@/components/forms/text-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { GRID_CELLS_CLASS } from "@/components/grid-section"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { pillLinkVariants } from "@/components/pill-link"
import { useToast } from "@/components/toast/toaster"
import { ROUTES } from "@/config/navigation"
import { removeBlogImage, uploadBlogImage } from "@/lib/blog-images"
import {
  type BlogCategory,
  blogImageUrl,
  type EditablePost,
  fromArgentinaInput,
  isFutureDate,
  postDisplayStatus,
  toArgentinaInput,
} from "@/lib/blog-shared"
import type { ContentStatus } from "@/lib/content-status"
import { cn } from "@/lib/utils"
import {
  countWords,
  POST_LIMITS,
  type PostDoc,
  type PostField,
  postSchema,
  readingMinutes,
  slugify,
} from "@/lib/validations/blog"

type FieldErrors = Partial<Record<PostField, string[]>>

type Values = Omit<EditablePost, "id" | "status" | "publishedAt"> & { publishedLocal: string }

const EMPTY_DOC: PostDoc = { type: "doc", content: [] }

const toValues = (post: EditablePost | null): Values => ({
  title: post?.title ?? "",
  slug: post?.slug ?? "",
  excerpt: post?.excerpt ?? "",
  content: post?.content ?? EMPTY_DOC,
  categoryId: post?.categoryId ?? null,
  tags: post?.tags ?? [],
  coverPath: post?.coverPath ?? null,
  coverAlt: post?.coverAlt ?? "",
  authorName: post?.authorName ?? "",
  featured: post?.featured ?? false,
  metaTitle: post?.metaTitle ?? "",
  metaDescription: post?.metaDescription ?? "",
  canonicalUrl: post?.canonicalUrl ?? "",
  noindex: post?.noindex ?? false,
  publishedLocal: toArgentinaInput(post?.publishedAt ?? null),
})

// Dirección con la que se muestra la vista previa de Google
const SITE_HOST = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://mujeresxmas.com").replace(/^https?:\/\//, "")

const SECONDARY_BUTTON = pillLinkVariants({ variant: "outline", size: "md" })
const SMALL_BUTTON = cn(pillLinkVariants({ variant: "outline", size: "sm" }), "rounded-lg")

function CharCount({ length, max, recommended }: { length: number; max: number; recommended?: string }) {
  return (
    <p className={cn("text-[13px] text-muted-foreground", length > max && "text-destructive")}>
      {length}/{max}
      {recommended && ` · ${recommended}`}
    </p>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-brand"
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-[13px] leading-snug text-muted-foreground">{hint}</span>
      </span>
    </label>
  )
}

function PanelCell({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-4 bg-background p-5", className)}>
      <h3 className="font-heading text-base font-semibold tracking-[-0.01em]">{title}</h3>
      {children}
    </section>
  )
}

type PostEditorProps = {
  post: EditablePost | null
  categories: BlogCategory[]
}

// Editor de publicaciones del blog: contenido a la izquierda, datos de publicación y SEO a la derecha.
export function PostEditor({ post, categories: initialCategories }: PostEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()

  const [values, setValues] = useState<Values>(() => toValues(post))
  const [status, setStatus] = useState<ContentStatus>(post?.status ?? "draft")
  const [saved, setSaved] = useState(() => JSON.stringify(toValues(post)))
  const [savedCover, setSavedCover] = useState(post?.coverPath ?? null)
  const [errors, setErrors] = useState<FieldErrors>({})
  // En una publicación nueva, la dirección sigue al título hasta que se la edita a mano
  const [slugTouched, setSlugTouched] = useState(Boolean(post))
  const [categories, setCategories] = useState(initialCategories)
  const [tagDraft, setTagDraft] = useState("")
  const [newCategory, setNewCategory] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const coverInput = useRef<HTMLInputElement>(null)

  const id = post?.id ?? null
  const dirty = JSON.stringify(values) !== saved
  const publishedAtIso = fromArgentinaInput(values.publishedLocal)
  const scheduled = isFutureDate(publishedAtIso)
  const words = countWords(values.content)
  const errorFor = (field: PostField) => errors[field]?.[0]

  function update<K extends keyof Values>(field: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function updateTitle(title: string) {
    setValues((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title).slice(0, POST_LIMITS.slug),
    }))
    setErrors((prev) => ({ ...prev, title: undefined, slug: slugTouched ? prev.slug : undefined }))
  }

  function notifyError(message: string) {
    toast({ id: "blog-editor", tone: "error", title: "Algo no salió bien", message })
  }

  function save(nextStatus: ContentStatus) {
    const { publishedLocal, ...fields } = values
    const input = { ...fields, status: nextStatus, publishedAt: fromArgentinaInput(publishedLocal) }

    const parsed = postSchema.safeParse(input)
    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors)
      notifyError("Revisá los campos marcados en rojo.")
      return
    }

    startTransition(async () => {
      const result = await savePost(id, input)
      if (result.status === "error") {
        setErrors(result.fieldErrors ?? {})
        notifyError(result.message ?? "Revisá los campos marcados en rojo.")
        return
      }
      const nextValues = { ...values, publishedLocal: toArgentinaInput(result.publishedAt) }
      setValues(nextValues)
      setSaved(JSON.stringify(nextValues))
      setSavedCover(values.coverPath)
      setStatus(nextStatus)
      setErrors({})
      setSlugTouched(true)
      toast({
        id: "blog-editor",
        tone: "success",
        title: "Listo",
        message:
          nextStatus === "published"
            ? isFutureDate(result.publishedAt)
              ? "La publicación quedó programada."
              : "La publicación ya está publicada."
            : nextStatus === "archived"
              ? "La publicación quedó archivada."
              : "Guardamos el borrador.",
      })
      // La primera vez que se guarda, la publicación pasa a tener su propia dirección
      if (!id) router.replace(`${ROUTES.adminBlog}/${result.id}`)
    })
  }

  function handleDelete() {
    if (!id) return
    startTransition(async () => {
      const result = await deletePost(id)
      if (!result.ok) {
        notifyError(result.message)
        return
      }
      router.push(ROUTES.adminBlog)
    })
  }

  function addTags(text: string) {
    const added = text
      .split(",")
      .map((tag) => tag.trim().slice(0, POST_LIMITS.tag))
      .filter(Boolean)
    if (added.length) update("tags", [...new Set([...values.tags, ...added])].slice(0, POST_LIMITS.tags))
    setTagDraft("")
  }

  function addCategory() {
    const name = newCategory?.trim()
    if (!name) return
    startTransition(async () => {
      const result = await saveCategory(null, { name, slug: slugify(name), description: "" })
      if (result.status === "error") {
        notifyError(
          result.message ?? result.fieldErrors?.slug?.[0] ?? result.fieldErrors?.name?.[0] ?? "Revisá el nombre."
        )
        return
      }
      setCategories((prev) => [...prev, result.category].sort((a, b) => a.name.localeCompare(b.name, "es")))
      update("categoryId", result.category.id)
      setNewCategory(null)
    })
  }

  async function pickCover(file: File) {
    setUploadingCover(true)
    const result = await uploadBlogImage(file, "covers")
    setUploadingCover(false)
    if (!result.ok) {
      notifyError(result.message)
      return
    }
    discardUnsavedCover()
    update("coverPath", result.path)
  }

  // La portada guardada se borra al guardar; una recién subida y reemplazada, en el momento
  function discardUnsavedCover() {
    if (values.coverPath && values.coverPath !== savedCover) void removeBlogImage(values.coverPath)
  }

  const onSaveShortcut = useEffectEvent((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault()
      if (!pending) save(status)
    }
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onSaveShortcut(event)
    window.addEventListener("keydown", listener)
    return () => window.removeEventListener("keydown", listener)
  }, [])

  // Avisa antes de irse con cambios sin guardar: al cerrar la pestaña y al tocar links del sitio
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.("a[href]")
      if (!link || link.getAttribute("target") === "_blank" || link.closest(".tiptap")) return
      if (!window.confirm("Tenés cambios sin guardar. ¿Querés salir igual?")) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    document.addEventListener("click", onClick, true)
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
      document.removeEventListener("click", onClick, true)
    }
  }, [dirty])

  const checklist = [
    { label: "Título", done: Boolean(values.title.trim()) },
    { label: "Bajada", done: Boolean(values.excerpt.trim()) },
    { label: "Contenido", done: words > 0 },
    { label: "Categoría", done: Boolean(values.categoryId) },
    { label: "Portada (recomendada)", done: Boolean(values.coverPath) },
    { label: "Descripción de la portada", done: !values.coverPath || Boolean(values.coverAlt.trim()) },
  ]

  const seoTitle = values.metaTitle.trim() || values.title.trim() || "Título de la publicación"
  const seoDescription =
    values.metaDescription.trim() || values.excerpt.trim() || "La bajada de la publicación va a aparecer acá."

  return (
    <>
      {/* Barra de acciones: queda a la vista mientras se escribe */}
      <div className="z-30 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:sticky lg:top-[57px]">
        <div className="flex min-w-0 items-center gap-3">
          <IconHoverArea>
            <Link
              href={ROUTES.adminBlog}
              aria-label="Volver a las publicaciones"
              title="Volver a las publicaciones"
              className="flex size-10 items-center justify-center rounded-lg ring-1 ring-border transition-colors duration-300 hover:bg-foreground/[0.04]"
            >
              <HoverIcon name="arrow-left" size={16} />
            </Link>
          </IconHoverArea>
          <PostStatusBadge status={postDisplayStatus(status, publishedAtIso)} />
          <p aria-live="polite" className="text-[13px] whitespace-nowrap text-muted-foreground">
            {dirty ? "Sin guardar" : id ? "Guardado" : "Nueva"}
            <span className="hidden sm:inline">
              {" "}
              · {words} {words === 1 ? "palabra" : "palabras"} · {readingMinutes(words)} min de lectura
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {id && (
            <IconHoverArea>
              <Link
                href={`${ROUTES.adminBlog}/${id}/vista-previa`}
                target="_blank"
                title={dirty ? "Muestra lo último guardado" : undefined}
                className={SECONDARY_BUTTON}
              >
                <HoverIcon name="eye" size={16} />
                Vista previa
              </Link>
            </IconHoverArea>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() => save(status === "archived" || status === "published" ? "draft" : status)}
            className={cn(SECONDARY_BUTTON, "cursor-pointer disabled:cursor-wait disabled:opacity-60")}
          >
            {status === "draft" ? "Guardar borrador" : "Pasar a borrador"}
          </button>
          <ShimmerSubmit
            size="md"
            pending={pending}
            pendingLabel="Guardando…"
            className="min-h-10"
            onClick={() => save("published")}
          >
            {status === "published" ? "Actualizar" : scheduled ? "Programar" : "Publicar"}
          </ShimmerSubmit>
        </div>
      </div>

      <div className={cn(GRID_CELLS_CLASS, "lg:grid-cols-[minmax(0,1fr)_22rem]")}>
        {/* Contenido */}
        <div className="flex min-w-0 flex-col gap-6 bg-background p-5 sm:p-8">
          <TextField
            label="Título"
            placeholder="Un título claro y atractivo"
            maxLength={POST_LIMITS.title}
            value={values.title}
            onChange={(event) => updateTitle(event.target.value)}
            error={errorFor("title")}
            className="h-14 font-heading text-xl font-semibold tracking-[-0.01em]"
          />

          <TextField
            label="Dirección"
            placeholder="titulo-de-la-publicacion"
            maxLength={POST_LIMITS.slug}
            value={values.slug}
            onChange={(event) => {
              setSlugTouched(true)
              update("slug", event.target.value.toLowerCase().replace(/\s+/g, "-"))
            }}
            onBlur={() => update("slug", slugify(values.slug))}
            error={errorFor("slug")}
            hint={
              <p className="text-[13px] break-all text-muted-foreground">
                {SITE_HOST}/blog/{values.slug || "…"}
                {status === "published" && (
                  <span className="mt-1 block break-normal text-foreground/70">
                    Ya está publicada: si cambiás la dirección, los links que se compartieron dejan de funcionar.
                  </span>
                )}
              </p>
            }
          />

          <TextareaField
            label="Bajada"
            placeholder="Dos o tres líneas que cuenten de qué se trata. Se muestra en el listado del blog."
            rows={3}
            maxLength={POST_LIMITS.excerpt}
            value={values.excerpt}
            onChange={(event) => update("excerpt", event.target.value)}
            error={errorFor("excerpt")}
            hint={<CharCount length={values.excerpt.length} max={POST_LIMITS.excerpt} />}
          />

          <RichEditor
            label="Contenido"
            content={values.content as PostDoc}
            error={errorFor("content")}
            onChange={(doc) => update("content", doc)}
          />
        </div>

        {/* Datos de la publicación */}
        <aside className="flex min-w-0 flex-col gap-px">
          <PanelCell title="Publicación">
            <TextField
              label="Fecha y hora (Argentina)"
              type="datetime-local"
              value={values.publishedLocal}
              onChange={(event) => update("publishedLocal", event.target.value)}
              error={errorFor("publishedAt")}
              hint={
                <p className="text-[13px] leading-snug text-muted-foreground">
                  {scheduled
                    ? "Se va a ver sola en el blog cuando llegue esta fecha."
                    : "Vacía: se publica en el momento. Con una fecha futura, queda programada."}
                </p>
              }
            />
            <Toggle
              label="Destacada"
              hint="Para mostrarla primero en el blog."
              checked={values.featured}
              onChange={(checked) => update("featured", checked)}
            />
            {id && (
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {status !== "archived" && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => save("archived")}
                    className={cn(SMALL_BUTTON, "cursor-pointer")}
                  >
                    Archivar
                  </button>
                )}
                {confirmDelete ? (
                  <>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={handleDelete}
                      className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-destructive px-4 text-[13px] font-medium text-white transition-opacity duration-300 hover:opacity-90"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className={cn(SMALL_BUTTON, "cursor-pointer")}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="inline-flex h-9 cursor-pointer items-center rounded-lg px-4 text-[13px] font-medium text-destructive ring-1 ring-destructive/30 transition-colors duration-300 hover:bg-destructive/[0.06]"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </PanelCell>

          <PanelCell title="Antes de publicar">
            <ul className="flex flex-col gap-2">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5 text-[13px]">
                  <span
                    aria-hidden
                    className={cn("size-2 shrink-0 rounded-full", item.done ? "bg-brand-green" : "bg-foreground/15")}
                  />
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                    {item.label}
                    <span className="sr-only">{item.done ? ": listo" : ": falta"}</span>
                  </span>
                </li>
              ))}
            </ul>
          </PanelCell>

          <PanelCell title="Categoría y etiquetas">
            <SelectField
              label="Categoría"
              value={values.categoryId ?? ""}
              onChange={(event) => update("categoryId", event.target.value || null)}
              error={errorFor("categoryId")}
            >
              <option value="">Sin categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </SelectField>

            {newCategory === null ? (
              <IconHoverArea className="self-start">
                <button type="button" onClick={() => setNewCategory("")} className={cn(SMALL_BUTTON, "cursor-pointer")}>
                  <HoverIcon name="plus" size={14} />
                  Nueva categoría
                </button>
              </IconHoverArea>
            ) : (
              <div className="flex flex-col gap-2 rounded-lg bg-foreground/[0.03] p-3">
                <TextField
                  label="Nombre de la categoría"
                  autoFocus
                  maxLength={60}
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addCategory()
                    }
                  }}
                  className="h-10"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pending || !newCategory.trim()}
                    onClick={addCategory}
                    className={cn(SMALL_BUTTON, "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50")}
                  >
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory(null)}
                    className={cn(SMALL_BUTTON, "cursor-pointer")}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <TextField
                label="Etiquetas"
                placeholder="Escribí y apretá Enter"
                disabled={values.tags.length >= POST_LIMITS.tags}
                maxLength={POST_LIMITS.tag}
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault()
                    addTags(tagDraft)
                  }
                  if (event.key === "Backspace" && !tagDraft && values.tags.length) {
                    update("tags", values.tags.slice(0, -1))
                  }
                }}
                onBlur={() => addTags(tagDraft)}
                error={errorFor("tags")}
              />
              {values.tags.length > 0 && (
                <ul className="flex flex-wrap gap-1.5">
                  {values.tags.map((tag) => (
                    <li key={tag}>
                      <IconHoverArea>
                        <button
                          type="button"
                          aria-label={`Quitar la etiqueta ${tag}`}
                          onClick={() =>
                            update(
                              "tags",
                              values.tags.filter((item) => item !== tag)
                            )
                          }
                          className="inline-flex h-7 max-w-full cursor-pointer items-center gap-1 rounded-md bg-brand-soft/60 pr-1.5 pl-2.5 text-[12px] font-medium transition-colors duration-200 hover:bg-brand-soft"
                        >
                          <span className="truncate">{tag}</span>
                          <HoverIcon name="x" size={12} />
                        </button>
                      </IconHoverArea>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <TextField
              label="Autoría (opcional)"
              placeholder="Quién la escribió"
              maxLength={POST_LIMITS.authorName}
              value={values.authorName}
              onChange={(event) => update("authorName", event.target.value)}
              error={errorFor("authorName")}
            />
          </PanelCell>

          <PanelCell title="Portada">
            {values.coverPath ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-foreground/[0.04]">
                <Image
                  src={blogImageUrl(values.coverPath)}
                  alt={values.coverAlt}
                  fill
                  sizes="22rem"
                  className="object-cover"
                />
              </div>
            ) : (
              <IconHoverArea>
                <button
                  type="button"
                  disabled={uploadingCover}
                  onClick={() => coverInput.current?.click()}
                  className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-[13px] text-muted-foreground transition-colors duration-300 hover:border-foreground/25 hover:text-foreground disabled:cursor-wait"
                >
                  <HoverIcon name="upload" size={20} />
                  {uploadingCover ? "Subiendo…" : "Subir imagen (JPG, PNG o WEBP)"}
                </button>
              </IconHoverArea>
            )}
            {values.coverPath && (
              <>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={uploadingCover}
                    onClick={() => coverInput.current?.click()}
                    className={cn(SMALL_BUTTON, "cursor-pointer")}
                  >
                    {uploadingCover ? "Subiendo…" : "Cambiar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      discardUnsavedCover()
                      update("coverPath", null)
                    }}
                    className={cn(SMALL_BUTTON, "cursor-pointer")}
                  >
                    Quitar
                  </button>
                </div>
                <TextField
                  label="Descripción de la imagen"
                  placeholder="Qué se ve en la imagen"
                  maxLength={POST_LIMITS.coverAlt}
                  value={values.coverAlt}
                  onChange={(event) => update("coverAlt", event.target.value)}
                  error={errorFor("coverAlt")}
                />
              </>
            )}
            <input
              ref={coverInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ""
                if (file) void pickCover(file)
              }}
            />
          </PanelCell>

          <PanelCell title="Buscadores (SEO)" className="flex-1">
            <div className="rounded-lg bg-foreground/[0.03] p-3">
              <p className="text-[11px] font-medium text-muted-foreground">Así se puede ver en Google</p>
              <p className="mt-2 text-[12px] break-all text-muted-foreground">
                {SITE_HOST} › blog › {values.slug || "…"}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[15px] leading-snug font-medium text-foreground">{seoTitle}</p>
              <p className="mt-1 line-clamp-3 text-[13px] leading-snug text-muted-foreground">{seoDescription}</p>
            </div>
            <TextField
              label="Título SEO (opcional)"
              placeholder="Si está vacío, se usa el título"
              maxLength={POST_LIMITS.metaTitle}
              value={values.metaTitle}
              onChange={(event) => update("metaTitle", event.target.value)}
              error={errorFor("metaTitle")}
              hint={<CharCount length={values.metaTitle.length} max={POST_LIMITS.metaTitle} />}
            />
            <TextareaField
              label="Descripción SEO (opcional)"
              placeholder="Si está vacía, se usa la bajada"
              maxLength={POST_LIMITS.metaDescription}
              value={values.metaDescription}
              onChange={(event) => update("metaDescription", event.target.value)}
              error={errorFor("metaDescription")}
              hint={<CharCount length={values.metaDescription.length} max={POST_LIMITS.metaDescription} />}
            />
            <TextField
              label="URL canónica (opcional)"
              placeholder="https://…"
              inputMode="url"
              value={values.canonicalUrl}
              onChange={(event) => update("canonicalUrl", event.target.value)}
              error={errorFor("canonicalUrl")}
              hint={
                <p className="text-[13px] leading-snug text-muted-foreground">
                  Solo si el texto se publicó primero en otro sitio.
                </p>
              }
            />
            <Toggle
              label="Ocultar de los buscadores"
              hint="Se puede ver con el link, pero no aparece en Google."
              checked={values.noindex}
              onChange={(checked) => update("noindex", checked)}
            />
          </PanelCell>
        </aside>
      </div>
    </>
  )
}
