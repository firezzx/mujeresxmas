"use client"

import { LoaderCircle } from "lucide-react"
import { useRef, useState, useTransition } from "react"

import { removeAvatar, saveAvatar } from "@/app/actions/profile"
import { FormMessage } from "@/components/forms/form-message"
import { UploadIcon, type UploadIconHandle } from "@/components/icons/upload"
import { UserAvatar } from "@/components/site-header/user-menu"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import { createClient } from "@/lib/supabase/client"
import type { CurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"
import { AVATAR_MAX_BYTES, AVATAR_SIZE_PX, AVATAR_SOURCE_MAX_BYTES, AVATAR_TYPES } from "@/lib/validations/profile"

// Recorta la imagen al centro en cuadrado y la comprime a WebP antes de subirla.
async function toSquareWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const size = Math.min(AVATAR_SIZE_PX, side)
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext("2d")
  if (!context) throw new Error("canvas")
  context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86))
  if (!blob) throw new Error("toBlob")
  return blob
}

// Foto de perfil: elegir, recortar, subir a Supabase Storage (avatars/<user_id>/) y quitar.
// Con `variant="cover"` la foto va grande, montada sobre la portada del perfil, y `heading`
// (nombre y correo) reemplaza al rótulo "Foto de perfil".
export function AvatarUploader({
  user,
  variant = "inline",
  heading,
}: {
  user: CurrentUser
  variant?: "inline" | "cover"
  heading?: React.ReactNode
}) {
  const cover = variant === "cover"
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const { iconRef, triggerProps } = useIconAnimation<UploadIconHandle>()

  const shownUrl = preview ?? user.avatarUrl

  function handleFile(file: File) {
    setError(undefined)
    if (!AVATAR_TYPES.includes(file.type as (typeof AVATAR_TYPES)[number])) {
      setError("Elegí una imagen JPG, PNG o WEBP.")
      return
    }
    if (file.size > AVATAR_SOURCE_MAX_BYTES) {
      setError("La imagen pesa demasiado. Elegí una de hasta 10 MB.")
      return
    }

    startTransition(async () => {
      try {
        const blob = await toSquareWebp(file)
        if (blob.size > AVATAR_MAX_BYTES) {
          setError("No pudimos achicar la imagen lo suficiente. Probá con otra.")
          return
        }
        const localUrl = URL.createObjectURL(blob)
        setPreview(localUrl)

        const supabase = createClient()
        const path = `${user.id}/${Date.now()}.webp`
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" })
        if (uploadError) throw uploadError

        const result = await saveAvatar(path)
        if (!result.ok) {
          await supabase.storage.from("avatars").remove([path])
          setPreview(null)
          setError(result.message)
        }
      } catch (err) {
        console.error("[avatar]", err)
        setPreview(null)
        setError("No pudimos subir la foto. Volvé a intentar.")
      }
    })
  }

  function handleRemove() {
    setError(undefined)
    startTransition(async () => {
      const result = await removeAvatar()
      if (result.ok) setPreview(null)
      else setError(result.message)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={cn("flex gap-5", cover ? "flex-col sm:flex-row sm:items-end" : "items-center")}>
        <button
          type="button"
          {...triggerProps}
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          aria-label="Cambiar foto de perfil"
          className={cn(
            "group relative shrink-0 cursor-pointer rounded-lg p-0.5 transition-shadow outline-none focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-wait",
            cover
              ? "-mt-16 size-28 bg-background p-1 shadow-[0_16px_32px_-16px_rgb(26_26_26/0.4)] ring-1 ring-foreground/[0.06] sm:-mt-20 sm:size-36"
              : "size-20 ring-1 ring-border hover:ring-foreground/25 sm:size-24"
          )}
        >
          <UserAvatar
            user={{ ...user, avatarUrl: shownUrl }}
            className={cn("size-full", cover ? "**:data-[slot=avatar-fallback]:text-4xl" : "text-xl")}
          />
          <span
            aria-hidden
            className={cn(
              "absolute flex items-center justify-center rounded-lg bg-foreground/45 text-background opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 data-[pending=true]:opacity-100",
              cover ? "inset-1" : "inset-0.5"
            )}
            data-pending={pending}
          >
            {pending ? (
              <LoaderCircle className="size-6 animate-spin" />
            ) : (
              <UploadIcon ref={iconRef} size={22} className="pointer-events-none" />
            )}
          </span>
        </button>

        <div
          className={cn(
            "flex flex-col items-start gap-2",
            cover && "w-full min-w-0 flex-1 gap-3 sm:flex-row sm:items-end sm:justify-between sm:pb-1"
          )}
        >
          {cover ? (
            <div className="w-full min-w-0 sm:w-auto">{heading}</div>
          ) : (
            <p className="text-sm font-medium">Foto de perfil</p>
          )}
          <div className={cn("flex flex-col items-start gap-2", cover && "sm:items-end")}>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={pending}
                className="h-9 cursor-pointer rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {pending ? "Guardando…" : shownUrl ? "Cambiar" : "Subir foto"}
              </button>
              {shownUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={pending}
                  className="h-9 cursor-pointer rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground disabled:cursor-wait"
                >
                  Quitar
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">JPG, PNG o WEBP. La recortamos en cuadrado.</p>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_TYPES.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) handleFile(file)
          event.target.value = ""
        }}
      />

      <FormMessage trigger={error} message={error} />
    </div>
  )
}
