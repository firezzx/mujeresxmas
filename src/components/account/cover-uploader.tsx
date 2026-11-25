"use client"

import { LoaderCircle } from "lucide-react"
import Image from "next/image"
import { useRef, useState, useTransition } from "react"

import { removeCover, saveCover } from "@/app/actions/profile"
import { FormMessage } from "@/components/forms/form-message"
import { UploadIcon, type UploadIconHandle } from "@/components/icons/upload"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import { createClient } from "@/lib/supabase/client"
import {
  AVATAR_SOURCE_MAX_BYTES,
  AVATAR_TYPES,
  COVER_MAX_BYTES,
  COVER_RATIO,
  COVER_WIDTH_PX,
} from "@/lib/validations/profile"

const COVER_BUCKET = "covers"

// Recorta la imagen al centro en apaisado (3 a 1) y la comprime a WebP antes de subirla.
async function toCoverWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const cropWidth = Math.min(bitmap.width, bitmap.height * COVER_RATIO)
  const cropHeight = cropWidth / COVER_RATIO
  const width = Math.round(Math.min(COVER_WIDTH_PX, cropWidth))
  const height = Math.round(width / COVER_RATIO)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d")
  if (!context) throw new Error("canvas")
  context.drawImage(
    bitmap,
    (bitmap.width - cropWidth) / 2,
    (bitmap.height - cropHeight) / 2,
    cropWidth,
    cropHeight,
    0,
    0,
    width,
    height
  )
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.84))
  if (!blob) throw new Error("toBlob")
  return blob
}

// Foto de portada del perfil, a todo el ancho y desde arriba de todo (el menú queda encima).
// Sin foto se ve `fallback` (el fondo de marca). `children` va arriba a la izquierda (la vuelta a Mi cuenta).
export function CoverUploader({
  userId,
  coverUrl,
  fallback,
  children,
}: {
  userId: string
  coverUrl: string | null
  fallback: React.ReactNode
  children?: React.ReactNode
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [removed, setRemoved] = useState(false)
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const { iconRef, triggerProps } = useIconAnimation<UploadIconHandle>()

  const shownUrl = preview ?? (removed ? null : coverUrl)

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
        const blob = await toCoverWebp(file)
        if (blob.size > COVER_MAX_BYTES) {
          setError("No pudimos achicar la imagen lo suficiente. Probá con otra.")
          return
        }
        setPreview(URL.createObjectURL(blob))

        const supabase = createClient()
        const path = `${userId}/${Date.now()}.webp`
        const { error: uploadError } = await supabase.storage
          .from(COVER_BUCKET)
          .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" })
        if (uploadError) throw uploadError

        const result = await saveCover(path)
        if (result.ok) {
          setRemoved(false)
        } else {
          await supabase.storage.from(COVER_BUCKET).remove([path])
          setPreview(null)
          setError(result.message)
        }
      } catch (err) {
        console.error("[cover]", err)
        setPreview(null)
        setError("No pudimos subir la portada. Volvé a intentar.")
      }
    })
  }

  function handleRemove() {
    setError(undefined)
    startTransition(async () => {
      const result = await removeCover()
      if (result.ok) {
        setPreview(null)
        setRemoved(true)
      } else setError(result.message)
    })
  }

  return (
    <div className="relative h-60 overflow-hidden sm:h-72 lg:h-80">
      {shownUrl ? (
        <Image
          src={shownUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          unoptimized={shownUrl.startsWith("blob:")}
          className="object-cover"
        />
      ) : (
        fallback
      )}

      {children && <div className="absolute inset-x-0 top-0">{children}</div>}

      <div className="absolute top-[4.75rem] right-4 flex flex-col items-end gap-2 sm:top-auto sm:right-6 sm:bottom-4 lg:right-8">
        <div className="flex gap-2">
          {shownUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={pending}
              className="h-9 cursor-pointer rounded-lg bg-background/85 px-3 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur transition-colors hover:bg-background hover:text-foreground disabled:cursor-wait"
            >
              Quitar
            </button>
          )}
          <button
            type="button"
            {...triggerProps}
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-background/85 px-3 text-sm font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background disabled:cursor-wait"
          >
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <UploadIcon ref={iconRef} size={16} className="pointer-events-none" />
            )}
            {pending ? "Guardando…" : shownUrl ? "Cambiar portada" : "Subir portada"}
          </button>
        </div>
        {error && (
          <div className="rounded-lg bg-background/90 px-3 py-1 shadow-sm backdrop-blur">
            <FormMessage trigger={error} message={error} />
          </div>
        )}
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
    </div>
  )
}
