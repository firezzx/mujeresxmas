"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { ROUTES } from "@/config/navigation"
import { ALL_AUDIENCE } from "@/content/sumate"
import { getAdminView } from "@/lib/admin"
import { campaignEmail, isEmailConfigured, type OutgoingEmail, personalize, sendEmails } from "@/lib/email"
import { getRequestOrigin } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/supabase/user"
import { type EmailCampaignField, emailCampaignSchema } from "@/lib/validations/material-lead"

export type EmailCampaignState =
  | { status: "idle" }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<EmailCampaignField, string[]>> }
  | { status: "test-sent"; to: string }
  | { status: "sent"; sent: number; failed: number }

// Manda un correo masivo a los contactos de /sumate (o una prueba a la administradora).
// Solo administradoras: la acción lo verifica y la RLS no deja leer los registros a nadie más.
export async function sendEmailCampaign(_prev: EmailCampaignState, formData: FormData): Promise<EmailCampaignState> {
  if ((await getAdminView()) !== "admin") {
    return { status: "error", message: "Solo las administradoras pueden enviar correos." }
  }

  const parsed = emailCampaignSchema.safeParse({
    subject: formData.get("subject")?.toString() ?? "",
    body: formData.get("body")?.toString() ?? "",
    audience: formData.get("audience")?.toString() ?? ALL_AUDIENCE,
  })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  if (!isEmailConfigured()) {
    return {
      status: "error",
      message: "Falta configurar el envío de correos (RESEND_API_KEY y EMAIL_FROM). Mirá docs/PRODUCCION.md.",
    }
  }

  const { subject, body, audience } = parsed.data

  // Prueba: solo a la administradora, con su nombre
  if (formData.get("mode") === "test") {
    const user = await getCurrentUser()
    if (!user?.email) return { status: "error", message: "No encontramos tu correo." }
    const name = user.firstName ?? "Mujeres x Más"
    const { html, text } = campaignEmail({ body: personalize(body, name), siteUrl: await getRequestOrigin() })
    const { sent } = await sendEmails([
      { to: user.email, subject: `[Prueba] ${personalize(subject, name)}`, html, text },
    ])
    if (!sent)
      return { status: "error", message: "Resend no aceptó el correo de prueba. Revisá la clave y el remitente." }
    return { status: "test-sent", to: user.email }
  }

  const supabase = await createClient()
  let query = supabase
    .from("material_leads")
    .select("email, full_name, unsubscribe_token")
    .eq("subscribed", true)
    .order("created_at", { ascending: true })
    .limit(5000)
  if (audience !== ALL_AUDIENCE) query = query.eq("country", audience)
  const { data, error } = await query
  if (error) {
    console.error("[sendEmailCampaign]", error.code, error.message)
    return { status: "error", message: "No pudimos leer la lista. Volvé a intentar." }
  }

  // Quien descargó más de un material recibe un solo correo
  const seen = new Set<string>()
  const origin = await getRequestOrigin()
  const emails: OutgoingEmail[] = []
  for (const row of data) {
    const key = row.email.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    const unsubscribeUrl = `${origin}${ROUTES.baja}?t=${row.unsubscribe_token}`
    const { html, text } = campaignEmail({ body: personalize(body, row.full_name), siteUrl: origin, unsubscribeUrl })
    emails.push({ to: row.email, subject: personalize(subject, row.full_name), html, text, unsubscribeUrl })
  }

  if (!emails.length) {
    return { status: "error", message: "No hay personas suscriptas para esa selección." }
  }

  const { sent, failed } = await sendEmails(emails)

  const { error: logError } = await supabase
    .from("email_campaigns")
    .insert({ subject, body, audience, recipients: sent, failed })
  if (logError) console.error("[sendEmailCampaign:log]", logError.code, logError.message)

  refresh()
  return { status: "sent", sent, failed }
}

// Da de baja o vuelve a suscribir a una persona desde el panel.
export async function setLeadSubscribed(id: string, subscribed: boolean) {
  if ((await getAdminView()) !== "admin") return
  if (!z.uuid().safeParse(id).success) return

  const supabase = await createClient()
  const { error } = await supabase.from("material_leads").update({ subscribed }).eq("id", id)
  if (error) console.error("[setLeadSubscribed]", error.code, error.message)
  refresh()
}
