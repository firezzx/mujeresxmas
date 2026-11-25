"use server"

import { after } from "next/server"
import { z } from "zod"

import { ROUTES } from "@/config/navigation"
import { TEAM_NOTICES } from "@/content/correos"
import { COMPANY_AUDIENCES } from "@/content/empresas"
import { adminNoticeEmail, notifyTeam } from "@/lib/email"
import { getRequestOrigin } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"
import { HONEYPOT_FIELD } from "@/lib/validations/auth"
import { companyLeadSchema } from "@/lib/validations/company-lead"

export type CompanyLeadState =
  | { status: "idle" }
  | {
      status: "error"
      message?: string
      fieldErrors?: { fullName?: string[]; company?: string[]; email?: string[]; audience?: string[] }
    }
  | { status: "sent" }

// Guarda el pedido de propuesta de una empresa. Las administradoras lo ven en /admin/empresas.
export async function requestCompanyProposal(_prev: CompanyLeadState, formData: FormData): Promise<CompanyLeadState> {
  // Campo trampa: si viene completo es un bot, y se le responde como si nada
  if (formData.get(HONEYPOT_FIELD)) return { status: "sent" }

  const parsed = companyLeadSchema.safeParse({
    fullName: formData.get("fullName"),
    company: formData.get("company"),
    email: formData.get("email"),
    audience: formData.get("audience"),
  })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { fullName, company, email, audience } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from("company_leads").insert({ full_name: fullName, company, email, audience })
  if (error) {
    console.error("[requestCompanyProposal]", error.code, error.message)
    return { status: "error", message: "No pudimos enviar tu pedido. Volvé a intentar en unos minutos." }
  }

  // Aviso a la casilla del equipo (si está configurada)
  const siteUrl = await getRequestOrigin()
  const audienceLabel = COMPANY_AUDIENCES.find((option) => option.value === audience)?.label ?? audience
  after(() =>
    notifyTeam(
      TEAM_NOTICES.company.subject.replace("{empresa}", company),
      adminNoticeEmail({
        title: TEAM_NOTICES.company.title,
        intro: TEAM_NOTICES.company.intro,
        rows: [
          ["Empresa", company],
          ["Contacto", fullName],
          ["Email", email],
          ["Quiere impulsar a", audienceLabel],
        ],
        siteUrl,
        panelPath: ROUTES.adminEmpresas,
        panelLabel: TEAM_NOTICES.company.panelLabel,
      })
    )
  )

  return { status: "sent" }
}
