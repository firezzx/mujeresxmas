import { connection } from "next/server"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export type CurrentUser = {
  id: string
  email: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

// Cacheado por request: header y páginas pueden pedirlo sin repetir consultas.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null

  // El cliente de Supabase compara el vencimiento del token con la hora actual: eso solo puede
  // pasar con el pedido real, no en el prerender (Partial Prefetching sí tiene las cookies).
  await connection()
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_path")
    .eq("id", claims.sub)
    .maybeSingle()

  const avatarUrl = profile?.avatar_path
    ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_path).data
        .publicUrl
    : null

  return {
    id: claims.sub,
    email: claims.email ?? null,
    firstName: profile?.first_name ?? null,
    lastName: profile?.last_name ?? null,
    avatarUrl,
  }
})
