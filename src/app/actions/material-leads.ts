"use server"

import { after } from "next/server"
import { z } from "zod"

import { ROUTES } from "@/config/navigation"
import { TEAM_NOTICES } from "@/content/correos"
import { SIGNUP_PAGE, THANK_YOU_EMAIL } from "@/content/sumate"
import { adminNoticeEmail, isEmailConfigured, notifyTeam, sendEmails, thankYouEmail } from "@/lib/email"
import { getRequestOrigin } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"
import { HONEYPOT_FIELD } from "@/lib/validations/auth"
import { materialLeadSchema } from "@/lib/validations/material-lead"

export type MaterialLeadState =
  | { status: "idle" }
  | {
      status: "error"
      message?: string
      fieldErrors?: { fullName?: string[]; email?: string[]; country?: string[] }
    }
  | { status: "sent" }

// Guarda el contacto de /sumate (las administradoras lo ven en /admin/contactos) y le manda el
// correo de agradecimiento.
export async function registerMaterialLead(_prev: MaterialLeadState, formData: FormData): Promise<MaterialLeadState> {
  // Campo trampa: si viene completo es un bot, y se le responde como si nada
  if (formData.get(HONEYPOT_FIELD)) return { status: "sent" }

  const parsed = materialLeadSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    country: formData.get("country"),
  })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { fullName, email, country } = parsed.data
  // El token de baja se arma acá: sin sesión no se puede leer la fila después de insertarla
  const unsubscribeToken = crypto.randomUUID()
  const supabase = await createClient()
  const { error } = await supabase.from("material_leads").insert({
    full_name: fullName,
    email,
    country,
    material: SIGNUP_PAGE.source,
    unsubscribe_token: unsubscribeToken,
  })
  // 23505: ya estaba registrada con ese correo. Se le responde igual, sin repetir el correo.
  if (error?.code === "23505") return { status: "sent" }
  if (error) {
    console.error("[registerMaterialLead]", error.code, error.message)
    return { status: "error", message: "No pudimos registrar tus datos. Volvé a intentar en unos minutos." }
  }

  const siteUrl = await getRequestOrigin()
  if (isEmailConfigured()) {
    const unsubscribeUrl = `${siteUrl}${ROUTES.baja}?t=${unsubscribeToken}`
    const message = thankYouEmail({ copy: THANK_YOU_EMAIL, fullName, siteUrl, unsubscribeUrl })
    // Después de responder: la persona ve el agradecimiento sin esperar a Resend
    after(async () => {
      const { failed } = await sendEmails([{ to: email, ...message, unsubscribeUrl }])
      if (failed) console.error("[registerMaterialLead] no salió el correo de agradecimiento")
    })
  }

  // Aviso a la casilla del equipo (si está configurada)
  after(() =>
    notifyTeam(
      TEAM_NOTICES.signup.subject.replace("{nombre}", fullName),
      adminNoticeEmail({
        title: TEAM_NOTICES.signup.title,
        rows: [
          ["Nombre", fullName],
          ["Email", email],
          ["País", country],
        ],
        siteUrl,
        panelPath: ROUTES.adminContactos,
        panelLabel: TEAM_NOTICES.signup.panelLabel,
      })
    )
  )

  return { status: "sent" }
}
