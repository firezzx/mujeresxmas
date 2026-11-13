import { connection } from "next/server"

import { COMPANY_AUDIENCES } from "@/content/empresas"
import { createClient } from "@/lib/supabase/server"

// Pedidos de propuesta de empresas (tabla company_leads). RLS: solo las administradoras leen.

export type CompanyLead = {
  id: string
  fullName: string
  company: string
  email: string
  audience: string
  createdAt: string
}

type CompanyLeadRow = {
  id: string
  full_name: string
  company: string
  email: string
  audience: string
  created_at: string
}

const AUDIENCE_LABELS: Record<string, string> = Object.fromEntries(
  COMPANY_AUDIENCES.map((option) => [option.value, option.label])
)

// Más nuevos primero. null si no se pudo leer (p. ej. falta la migración).
export async function listCompanyLeads(): Promise<CompanyLead[] | null> {
  await connection()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("company_leads")
    .select("id, full_name, company, email, audience, created_at")
    .order("created_at", { ascending: false })
    .limit(200)
  if (error) {
    console.error("[listCompanyLeads]", error.code, error.message)
    return null
  }

  return (data as CompanyLeadRow[]).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    company: row.company,
    email: row.email,
    audience: AUDIENCE_LABELS[row.audience] ?? row.audience,
    createdAt: row.created_at,
  }))
}
