"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { getAdminView } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { type NotificationField, notificationSchema } from "@/lib/validations/notification"

export type SendNotificationState =
  | { status: "idle" | "sent" }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<NotificationField, string[]>> }

// Envía un aviso a todas las usuarias. Solo administradoras (también lo exige la RLS).
export async function sendNotification(
  _prev: SendNotificationState,
  formData: FormData
): Promise<SendNotificationState> {
  if ((await getAdminView()) !== "admin") {
    return { status: "error", message: "Solo las administradoras pueden enviar notificaciones." }
  }

  const parsed = notificationSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    body: formData.get("body")?.toString() ?? "",
    link: formData.get("link")?.toString() ?? "",
  })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  const { error } = await supabase
    .from("notifications")
    .insert({ ...parsed.data, user_id: null, created_by: claims?.claims?.sub ?? null })
  if (error) {
    console.error("[sendNotification]", error.code, error.message)
    return { status: "error", message: "No pudimos enviar la notificación. Volvé a intentar." }
  }

  refresh()
  return { status: "sent" }
}

// Marca como leídas las notificaciones indicadas para la usuaria de la sesión.
export async function markNotificationsRead(input: string[]) {
  const parsed = z.array(z.uuid()).max(50).safeParse(input)
  if (!parsed.success || !parsed.data.length) return
  const ids = parsed.data

  const supabase = await createClient()
  const { data: claims } = await supabase.auth.getClaims()
  const userId = claims?.claims?.sub
  if (!userId) return

  const { error } = await supabase.from("notification_reads").upsert(
    ids.map((id) => ({ notification_id: id, user_id: userId })),
    { onConflict: "notification_id,user_id", ignoreDuplicates: true }
  )
  if (error) console.error("[markNotificationsRead]", error.code, error.message)

  refresh()
}
