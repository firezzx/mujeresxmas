import { connection } from "next/server"

import { createClient } from "@/lib/supabase/server"

export type Plan = {
  id: string
  name: string
  description: string | null
  priceArs: number
  features: string[]
  isActive: boolean
}

type PlanRow = {
  id: string
  name: string
  description: string | null
  price_ars: number | null
  features: string[]
  is_active: boolean
}

// Planes en el orden en que se muestran. Para sumar un campo: columna en una migración, una línea en
// los tipos y en el select.
export async function listPlans(): Promise<Plan[] | null> {
  await connection()
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("plans")
    .select("id, name, description, price_ars, features, is_active")
    .order("sort_order")
  if (error) {
    console.error("[listPlans]", error.code, error.message)
    return null
  }
  return (data as PlanRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    priceArs: row.price_ars ?? 0,
    features: row.features,
    isActive: row.is_active,
  }))
}
