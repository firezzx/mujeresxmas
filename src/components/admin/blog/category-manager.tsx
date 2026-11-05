"use client"

import { useRef, useState, useTransition } from "react"
import { z } from "zod"

import { deleteCategory, saveCategory } from "@/app/actions/blog"
import { AdminEmpty, AdminList, AdminRow } from "@/components/admin/admin-ui"
import { ShimmerSubmit } from "@/components/buttons/shimmer-submit"
import { TextField } from "@/components/forms/text-field"
import { TextareaField } from "@/components/forms/textarea-field"
import { pillLinkVariants } from "@/components/pill-link"
import { useToast } from "@/components/toast/toaster"
import type { BlogCategory } from "@/lib/blog-shared"
import { cn } from "@/lib/utils"
import { type CategoryField, categorySchema, slugify } from "@/lib/validations/blog"

type FieldErrors = Partial<Record<CategoryField, string[]>>

const EMPTY = { name: "", slug: "", description: "" }

const SMALL_BUTTON = cn(pillLinkVariants({ variant: "outline", size: "sm" }), "cursor-pointer rounded-lg")

// Alta, edición y baja de las categorías del blog.
export function CategoryManager({ categories }: { categories: BlogCategory[] }) {
  const { toast } = useToast()
  const [pending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [values, setValues] = useState(EMPTY)
  const [slugTouched, setSlugTouched] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function reset() {
    setEditingId(null)
    setValues(EMPTY)
    setSlugTouched(false)
    setErrors({})
  }

  function startEditing(category: BlogCategory) {
    setEditingId(category.id)
    setValues({ name: category.name, slug: category.slug, description: category.description ?? "" })
    setSlugTouched(true)
    setErrors({})
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = categorySchema.safeParse(values)
    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors)
      return
    }
    startTransition(async () => {
      const result = await saveCategory(editingId, values)
      if (result.status === "error") {
        setErrors(result.fieldErrors ?? {})
        if (result.message)
          toast({ id: "blog-category", tone: "error", title: "Algo no salió bien", message: result.message })
        return
      }
      toast({
        id: "blog-category",
        tone: "success",
        title: "Listo",
        message: editingId ? "Guardamos los cambios." : "La categoría ya está creada.",
      })
      reset()
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCategory(id)
      setConfirmingId(null)
      if (!result.ok) {
        toast({ id: "blog-category", tone: "error", title: "Algo no salió bien", message: result.message })
        return
      }
      if (editingId === id) reset()
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-10">
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <h3 className="font-heading text-base font-semibold tracking-[-0.01em]">
          {editingId ? "Editar categoría" : "Nueva categoría"}
        </h3>
        <TextField
          label="Nombre"
          maxLength={60}
          placeholder="Ej.: Liderazgo"
          value={values.name}
          onChange={(event) => {
            const name = event.target.value
            setValues((prev) => ({ ...prev, name, slug: slugTouched ? prev.slug : slugify(name) }))
            setErrors((prev) => ({ ...prev, name: undefined, slug: slugTouched ? prev.slug : undefined }))
          }}
          error={errors.name?.[0]}
        />
        <TextField
          label="Dirección"
          maxLength={80}
          placeholder="liderazgo"
          value={values.slug}
          onChange={(event) => {
            setSlugTouched(true)
            setValues((prev) => ({ ...prev, slug: event.target.value.toLowerCase().replace(/\s+/g, "-") }))
            setErrors((prev) => ({ ...prev, slug: undefined }))
          }}
          error={errors.slug?.[0]}
          hint={<p className="text-sm text-muted-foreground">Se usa para filtrar el blog: /blog?categoria=…</p>}
        />
        <TextareaField
          label="Descripción (opcional)"
          maxLength={200}
          value={values.description}
          onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
          error={errors.description?.[0]}
        />
        <div className="flex flex-wrap items-center gap-2">
          <ShimmerSubmit size="md" pending={pending} pendingLabel="Guardando…">
            {editingId ? "Guardar cambios" : "Crear categoría"}
          </ShimmerSubmit>
          {editingId && (
            <button type="button" onClick={reset} className={SMALL_BUTTON}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="min-w-0">
        {categories.length ? (
          <AdminList>
            {categories.map((category) => (
              <AdminRow
                key={category.id}
                title={category.name}
                detail={
                  <>
                    {category.postCount} {category.postCount === 1 ? "publicación" : "publicaciones"}
                    {category.description && ` · ${category.description}`}
                  </>
                }
                aside={
                  confirmingId === category.id ? (
                    <>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => handleDelete(category.id)}
                        className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-destructive px-4 text-sm font-medium text-white transition-opacity duration-300 hover:opacity-90"
                      >
                        Sí, eliminar
                      </button>
                      <button type="button" onClick={() => setConfirmingId(null)} className={SMALL_BUTTON}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => startEditing(category)} className={SMALL_BUTTON}>
                        Editar
                      </button>
                      <button
                        type="button"
                        disabled={category.postCount > 0}
                        title={
                          category.postCount > 0 ? "Tiene publicaciones: primero movelas a otra categoría" : undefined
                        }
                        onClick={() => setConfirmingId(category.id)}
                        className={cn(SMALL_BUTTON, "disabled:cursor-not-allowed disabled:opacity-50")}
                      >
                        Eliminar
                      </button>
                    </>
                  )
                }
              />
            ))}
          </AdminList>
        ) : (
          <AdminEmpty
            icon="file-text"
            tone="pink"
            title="Todavía no hay categorías"
            text="Creá la primera para poder ordenar las publicaciones."
          />
        )}
      </div>
    </div>
  )
}
