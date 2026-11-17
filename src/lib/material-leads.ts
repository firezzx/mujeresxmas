import { connection } from "next/server"

import { createClient } from "@/lib/supabase/server"

// Contactos de /sumate (tabla material_leads) y correos masivos enviados (email_campaigns).
// RLS: solo las administradoras leen.

export type MaterialLead = {
  id: string
  fullName: string
  email: string
  country: string
  material: string
  subscribed: boolean
  createdAt: string
}

type MaterialLeadRow = {
  id: string
  full_name: string
  email: string
  country: string
  material: string
  subscribed: boolean
  created_at: string
}

// Más nuevos primero. null si no se pudo leer (p. ej. falta la migración).
export async function listMaterialLeads(): Promise<MaterialLead[] | null> {
  await connection()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("material_leads")
    .select("id, full_name, email, country, material, subscribed, created_at")
    .order("created_at", { ascending: false })
    .limit(5000)
  if (error) {
    console.error("[listMaterialLeads]", error.code, error.message)
    return null
  }

  return (data as MaterialLeadRow[]).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    country: row.country,
    material: row.material,
    subscribed: row.subscribed,
    createdAt: row.created_at,
  }))
}

export type EmailCampaign = {
  id: string
  subject: string
  audience: string
  recipients: number
  failed: number
  createdAt: string
}

export async function listEmailCampaigns(): Promise<EmailCampaign[] | null> {
  await connection()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("email_campaigns")
    .select("id, subject, audience, recipients, failed, created_at")
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) {
    console.error("[listEmailCampaigns]", error.code, error.message)
    return null
  }

  return data.map((row) => ({
    id: row.id,
    subject: row.subject,
    audience: row.audience,
    recipients: row.recipients,
    failed: row.failed,
    createdAt: row.created_at,
  }))
}
