import { cookies } from "next/headers"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/supabase/user"

// Cookie de "Ver como usuario": solo cambia lo que se muestra, nunca los permisos reales.
export const MEMBER_VIEW_COOKIE = "mxm_vista_usuaria"

// Cookie de "Mostrar en preparación": muestra en el panel las pestañas marcadas como pending en ADMIN_NAV.
export const ADMIN_PENDING_COOKIE = "mxm_admin_en_preparacion"

export async function showsPendingSections() {
  return (await cookies()).get(ADMIN_PENDING_COOKIE)?.value === "1"
}

// "admin": ve las herramientas de administración. "member": eligió ver el sitio como una
// usuaria común. null: no es administradora (o no hay sesión).
export type AdminView = "admin" | "member"

export const getAdminView = cache(async (): Promise<AdminView | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("is_admin")
  if (error) console.error("[is_admin]", error.code, error.message)
  if (data !== true) return null

  return (await cookies()).get(MEMBER_VIEW_COOKIE)?.value === "1" ? "member" : "admin"
})

export type AdminMember = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone: string | null
  city: string | null
  businessName: string | null
  avatarUrl: string | null
  planName: string | null
  joinedAt: string
  emailConfirmed: boolean
  lastSignInAt: string | null
  isAdmin: boolean
}

type MemberRow = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  city: string | null
  business_name: string | null
  avatar_path: string | null
  plan_name: string | null
  joined_at: string
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  is_admin: boolean
}

// Todas las usuarias con perfil y membresía. La función de la base rechaza a quien no es
// administradora, así que esto no depende solo de la verificación de la página.
// Para muchas usuarias, sumar paginado en admin_list_members.
export async function listMembers(): Promise<AdminMember[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("admin_list_members")
  if (error) {
    console.error("[admin_list_members]", error.code, error.message)
    return null
  }

  return (data as MemberRow[]).map((row) => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    city: row.city,
    businessName: row.business_name,
    avatarUrl: row.avatar_path ? supabase.storage.from("avatars").getPublicUrl(row.avatar_path).data.publicUrl : null,
    planName: row.plan_name,
    joinedAt: row.joined_at,
    emailConfirmed: Boolean(row.email_confirmed_at),
    lastSignInAt: row.last_sign_in_at,
    isAdmin: row.is_admin,
  }))
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

// Números del encabezado del panel.
export function memberStats(members: AdminMember[]) {
  const weekAgo = Date.now() - WEEK_MS
  return [
    { label: "Usuarios registrados", value: members.length },
    { label: "Nuevos esta semana", value: members.filter((m) => new Date(m.joinedAt).getTime() >= weekAgo).length },
    { label: "Perfiles completos", value: members.filter((m) => m.firstName && m.city).length },
    { label: "Sin confirmar el correo", value: members.filter((m) => !m.emailConfirmed).length },
  ]
}
