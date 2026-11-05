import { cache } from "react"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, type CurrentUser } from "@/lib/supabase/user"
import { PROFILE_FIELDS, type ProfileField } from "@/lib/validations/profile"

export type ActiveMembership = {
  planId: string
  planName: string
  planDescription: string | null
  planPriceArs: number
  planFeatures: string[]
  startedAt: string
}

export type AccountSummary = {
  user: CurrentUser
  memberSince: string | null
  membership: ActiveMembership | null
}

// Datos del panel Mi Cuenta. Las políticas RLS ya limitan todo a la usuaria de la sesión.
// Cuando existan cursos, eventos y notificaciones, sus consultas se suman acá.
export const getAccountSummary = cache(async (): Promise<AccountSummary | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase.from("profiles").select("created_at").eq("id", user.id).maybeSingle(),
    supabase
      .from("memberships")
      .select("started_at, plans (id, name, description, price_ars, features)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle(),
  ])

  // Sin tipos generados, Supabase no sabe que la relación es uno a uno
  const plan = membership?.plans as unknown as
    | { id: string; name: string; description: string | null; price_ars: number | null; features: string[] }
    | null
    | undefined

  return {
    user,
    memberSince: profile?.created_at ?? null,
    membership:
      membership && plan
        ? {
            planId: plan.id,
            planName: plan.name,
            planDescription: plan.description,
            planPriceArs: plan.price_ars ?? 0,
            planFeatures: plan.features,
            startedAt: membership.started_at,
          }
        : null,
  }
})

export type EditableProfile = {
  user: CurrentUser
  values: Record<ProfileField, string>
}

// Datos actuales del perfil para precargar el formulario de edición.
export const getEditableProfile = cache(async (): Promise<EditableProfile | null> => {
  const user = await getCurrentUser()
  if (!user) return null

  const columns = PROFILE_FIELDS.map((field) => field.name)
  const supabase = await createClient()
  const { data } = await supabase.from("profiles").select(columns.join(", ")).eq("id", user.id).maybeSingle()
  const row = (data ?? {}) as unknown as Partial<Record<ProfileField, string | null>>

  return {
    user,
    values: Object.fromEntries(columns.map((name) => [name, row[name] ?? ""])) as Record<ProfileField, string>,
  }
})
