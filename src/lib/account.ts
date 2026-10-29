import { cache } from "react"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, type CurrentUser } from "@/lib/supabase/user"

export type ActiveMembership = {
  planId: string
  planName: string
  planDescription: string | null
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
      .select("started_at, plans (id, name, description)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle(),
  ])

  // Sin tipos generados, Supabase no sabe que la relación es uno a uno
  const plan = membership?.plans as unknown as
    | { id: string; name: string; description: string | null }
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
            startedAt: membership.started_at,
          }
        : null,
  }
})
