import { BLOG_BUCKET } from "@/lib/blog-shared"
import { createClient } from "@/lib/supabase/client"

const MAX_WIDTH_PX = 1600
const SOURCE_MAX_BYTES = 15 * 1024 * 1024 // 15 MB
const UPLOAD_MAX_BYTES = 5 * 1024 * 1024 // 5 MB, igual que el bucket
const TYPES = ["image/jpeg", "image/png", "image/webp"]

// Achica la imagen a un ancho razonable para el blog y la comprime a WebP.
async function toWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_WIDTH_PX / bitmap.width)
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const context = canvas.getContext("2d")
  if (!context) throw new Error("canvas")
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.84))
  if (!blob) throw new Error("toBlob")
  return blob
}

export type UploadResult = { ok: true; path: string } | { ok: false; message: string }

// Comprime y sube una imagen del blog desde el navegador. La RLS solo se lo permite a administradoras.
export async function uploadBlogImage(file: File, folder: "covers" | "inline"): Promise<UploadResult> {
  if (!TYPES.includes(file.type)) return { ok: false, message: "Elegí una imagen JPG, PNG o WEBP." }
  if (file.size > SOURCE_MAX_BYTES) return { ok: false, message: "La imagen pesa demasiado. Elegí una de hasta 15 MB." }

  try {
    const blob = await toWebp(file)
    if (blob.size > UPLOAD_MAX_BYTES) {
      return { ok: false, message: "No pudimos achicar la imagen lo suficiente. Probá con otra." }
    }
    const path = `${folder}/${crypto.randomUUID()}.webp`
    const { error } = await createClient()
      .storage.from(BLOG_BUCKET)
      .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" })
    if (error) throw error
    return { ok: true, path }
  } catch (error) {
    console.error("[uploadBlogImage]", error)
    return { ok: false, message: "No pudimos subir la imagen. Volvé a intentar." }
  }
}

// Borra una imagen recién subida que se reemplazó antes de guardar la publicación.
export async function removeBlogImage(path: string) {
  const { error } = await createClient().storage.from(BLOG_BUCKET).remove([path])
  if (error) console.error("[removeBlogImage]", error.message)
}
