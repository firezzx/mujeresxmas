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

// Registra la foto que el navegador ya subió a avatars/<user_id>/ y borra la anterior.
export async function saveAvatar(path: string): Promise<AvatarResult> {
  const { supabase, userId } = await getSessionUserId()
  if (!userId) return { ok: false, message: SESSION_EXPIRED }
  if (!path.startsWith(`${userId}/`) || path.includes("..")) {
    return { ok: false, message: "No pudimos guardar la foto. Volvé a intentar." }
  }

  const { data: profile } = await supabase.from("profiles").select("avatar_path").eq("id", userId).maybeSingle()
  const { error } = await supabase.from("profiles").update({ avatar_path: path }).eq("id", userId)
  if (error) {
    console.error("[saveAvatar]", error.code, error.message)
    return { ok: false, message: "No pudimos guardar la foto. Volvé a intentar." }
  }

  if (profile?.avatar_path && profile.avatar_path !== path) {
    await supabase.storage.from(AVATAR_BUCKET).remove([profile.avatar_path])
  }

  refresh()
  return { ok: true }
}

export async function removeAvatar(): Promise<AvatarResult> {
  const { supabase, userId } = await getSessionUserId()
  if (!userId) return { ok: false, message: SESSION_EXPIRED }

  const { data: profile } = await supabase.from("profiles").select("avatar_path").eq("id", userId).maybeSingle()
  const { error } = await supabase.from("profiles").update({ avatar_path: null }).eq("id", userId)
  if (error) {
    console.error("[removeAvatar]", error.code, error.message)
    return { ok: false, message: "No pudimos quitar la foto. Volvé a intentar." }
  }

  if (profile?.avatar_path) await supabase.storage.from(AVATAR_BUCKET).remove([profile.avatar_path])

  refresh()
  return { ok: true }
}
