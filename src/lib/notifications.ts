import { cache } from "react"
import { connection } from "next/server"

import { createClient } from "@/lib/supabase/server"

// Supabase compara el vencimiento del token con la hora actual: solo puede pasar en el pedido
// real, no en el prerender
async function getClient() {
  await connection()
  return createClient()
}

// Notificaciones (supabase/migrations/*_cursos_eventos_notificaciones.sql).
// user_id null = para todas las usuarias.

export type UserNotification = {
  id: string
  title: string
  body: string | null
  link: string | null
  createdAt: string
  read: boolean
}

type NotificationRow = { id: string; title: string; body: string | null; link: string | null; created_at: string }

// Cuántas se traen para Mi cuenta y el contador del header
const RECENT_LIMIT = 20

// Últimas notificaciones de la usuaria (RLS: las suyas y las generales) con su estado de lectura.
export const getMyNotifications = cache(async (userId: string): Promise<UserNotification[]> => {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, body, link, created_at")
    .order("created_at", { ascending: false })
    .limit(RECENT_LIMIT)
  if (error) {
    console.error("[getMyNotifications]", error.code, error.message)
    return []
  }

  const rows = data as NotificationRow[]
  if (!rows.length) return []

  const { data: reads } = await supabase
    .from("notification_reads")
    .select("notification_id")
    .eq("user_id", userId)
    .in(
      "notification_id",
      rows.map((row) => row.id)
    )
  const readIds = new Set((reads ?? []).map((read) => read.notification_id as string))

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    link: row.link,
    createdAt: row.created_at,
    read: readIds.has(row.id),
  }))
})

export const countUnread = (notifications: UserNotification[]) => notifications.filter((n) => !n.read).length

// ─── Administración ────────────────────────────────────────────────────────────────────

export type SentNotification = {
  id: string
  title: string
  body: string | null
  link: string | null
  forEveryone: boolean
  createdAt: string
  reads: number
}

// Notificaciones enviadas, con cuántas usuarias las leyeron. RLS: solo administradoras.
export async function listSentNotifications(): Promise<SentNotification[] | null> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("id, title, body, link, user_id, created_at, notification_reads (count)")
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) {
    console.error("[listSentNotifications]", error.code, error.message)
    return null
  }

  return (data as (NotificationRow & { user_id: string | null; notification_reads: { count: number }[] })[]).map(
    (row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      link: row.link,
      forEveryone: row.user_id === null,
      createdAt: row.created_at,
      reads: row.notification_reads[0]?.count ?? 0,
    })
  )
}
