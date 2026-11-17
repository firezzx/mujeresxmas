import { z } from "zod"

import { COUNTRIES } from "@/content/sumate"
import { emailSchema } from "@/lib/validations/auth"

// Registro de la página /sumate. Los límites siguen los de la tabla material_leads
// (supabase/migrations/*_descargas_y_correos.sql).
export const materialLeadSchema = z.object({
  fullName: z
    .string({ error: "Ingresá tu nombre y apellido" })
    .trim()
    .min(2, "Ingresá tu nombre y apellido")
    .max(120, "El nombre es demasiado largo"),
  email: emailSchema,
  country: z.enum(COUNTRIES, { error: "Elegí tu país" }),
})

export type MaterialLeadInput = z.infer<typeof materialLeadSchema>

// Correo masivo que arma una administradora en /admin/contactos.
export const emailCampaignSchema = z.object({
  subject: z.string().trim().min(2, "Escribí el asunto").max(160, "Asunto: hasta 160 caracteres"),
  body: z.string().trim().min(2, "Escribí el mensaje").max(20000, "El mensaje es demasiado largo"),
  // "todas" o el nombre de un país
  audience: z.string().trim().min(2).max(60),
})

export type EmailCampaignInput = z.infer<typeof emailCampaignSchema>
export type EmailCampaignField = keyof EmailCampaignInput
