import { connection } from "next/server"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export type LatestMember = {
  initials: string
  avatarUrl: string | null
}

type LatestMemberRow = {
  initials: string | null
  avatar_path: string | null
}

// Últimas personas registradas (supabase/migrations/*_ultimas_registradas.sql). Los perfiles son
// privados: la función de la base entrega solo la foto y las iniciales. Si falla, no se muestra ninguna.
export const getLatestMembers = cache(async (): Promise<LatestMember[]> => {
  await connection()
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("latest_members", { max_count: 4 })
  if (error) {
    console.error("[getLatestMembers]", error.code, error.message)
    return []
  }
  return (data as LatestMemberRow[]).map((row) => ({
    initials: row.initials ?? "",
    avatarUrl: row.avatar_path ? supabase.storage.from("avatars").getPublicUrl(row.avatar_path).data.publicUrl : null,
  }))
})
