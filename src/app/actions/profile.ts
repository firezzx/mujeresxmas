"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { PROFILE_FIELDS, profileSchema, type ProfileField } from "@/lib/validations/profile"

const AVATAR_BUCKET = "avatars"
const SESSION_EXPIRED = "Tu sesión venció. Volvé a iniciar sesión para guardar los cambios."

// Usuaria de la sesión (las políticas RLS hacen el resto)
async function getSessionUserId() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  return { supabase, userId: data?.claims?.sub ?? null }
}

export type ProfileState =
  | { status: "idle" | "saved" }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<ProfileField, string[]>> }

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const raw = Object.fromEntries(PROFILE_FIELDS.map(({ name }) => [name, formData.get(name)?.toString() ?? ""]))
  const parsed = profileSchema.safeParse(raw)
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { supabase, userId } = await getSessionUserId()
  if (!userId) return { status: "error", message: SESSION_EXPIRED }

  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", userId)
  if (error) {
    console.error("[updateProfile]", error.code, error.message)
    return { status: "error", message: "No pudimos guardar los cambios. Volvé a intentar." }
  }

  // Actualiza el header y Mi Cuenta con los datos nuevos
  refresh()
  return { status: "saved" }
}

export type AvatarResult = { ok: true } | { ok: false; message: string }

// Fotos del perfil: cada una tiene su bucket y su columna con la ruta del archivo.
const IMAGES = {
  avatar: { bucket: AVATAR_BUCKET, column: "avatar_path", label: "la foto" },
  cover: { bucket: "covers", column: "cover_path", label: "la portada" },
} as const

type ImageKind = keyof typeof IMAGES

async function currentImagePath(kind: ImageKind, userId: string) {
  const { supabase } = await getSessionUserId()
  const { column } = IMAGES[kind]
  const { data } = await supabase.from("profiles").select(column).eq("id", userId).maybeSingle()
  return ((data as Record<string, string | null> | null)?.[column] ?? null) as string | null
}

// Registra la imagen que el navegador ya subió a <bucket>/<user_id>/ y borra la anterior.
async function saveImage(kind: ImageKind, path: string): Promise<AvatarResult> {
  const { bucket, column, label } = IMAGES[kind]
  const failure = { ok: false as const, message: `No pudimos guardar ${label}. Volvé a intentar.` }
  const { supabase, userId } = await getSessionUserId()
  if (!userId) return { ok: false, message: SESSION_EXPIRED }
  if (!path.startsWith(`${userId}/`) || path.includes("..")) return failure

  const previous = await currentImagePath(kind, userId)
  const { error } = await supabase
    .from("profiles")
    .update({ [column]: path })
    .eq("id", userId)
  if (error) {
    console.error(`[save ${kind}]`, error.code, error.message)
    return failure
  }

  if (previous && previous !== path) await supabase.storage.from(bucket).remove([previous])

  refresh()
  return { ok: true }
}

async function removeImage(kind: ImageKind): Promise<AvatarResult> {
  const { bucket, column, label } = IMAGES[kind]
  const { supabase, userId } = await getSessionUserId()
  if (!userId) return { ok: false, message: SESSION_EXPIRED }

  const previous = await currentImagePath(kind, userId)
  const { error } = await supabase
    .from("profiles")
    .update({ [column]: null })
    .eq("id", userId)
  if (error) {
    console.error(`[remove ${kind}]`, error.code, error.message)
    return { ok: false, message: `No pudimos quitar ${label}. Volvé a intentar.` }
  }

  if (previous) await supabase.storage.from(bucket).remove([previous])

  refresh()
  return { ok: true }
}

export async function saveAvatar(path: string) {
  return saveImage("avatar", path)
}

export async function removeAvatar() {
  return removeImage("avatar")
}

export async function saveCover(path: string) {
  return saveImage("cover", path)
}

export async function removeCover() {
  return removeImage("cover")
}
