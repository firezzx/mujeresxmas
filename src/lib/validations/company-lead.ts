import { z } from "zod"

import { COMPANY_AUDIENCES } from "@/content/empresas"
import { emailSchema } from "@/lib/validations/auth"

const AUDIENCE_VALUES = COMPANY_AUDIENCES.map((option) => option.value) as [
  (typeof COMPANY_AUDIENCES)[number]["value"],
  ...(typeof COMPANY_AUDIENCES)[number]["value"][],
]

// Pedido de propuesta de una empresa (página /empresas). Los límites siguen los de la tabla
// company_leads (supabase/migrations/*_membresias_y_empresas.sql).
export const companyLeadSchema = z.object({
  fullName: z
    .string({ error: "Ingresá tu nombre y apellido" })
    .trim()
    .min(2, "Ingresá tu nombre y apellido")
    .max(120, "El nombre es demasiado largo"),
  company: z
    .string({ error: "Ingresá la empresa u organización" })
    .trim()
    .min(2, "Ingresá la empresa u organización")
    .max(160, "El nombre es demasiado largo"),
  email: emailSchema,
  audience: z.enum(AUDIENCE_VALUES, { error: "Elegí a quiénes querés impulsar" }),
})

export type CompanyLeadInput = z.infer<typeof companyLeadSchema>
