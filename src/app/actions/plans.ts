"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { getAdminView } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { FREE_PLAN_ID, type PlanField, planSchema } from "@/lib/validations/plan"

export type UpdatePlanState =
  | { status: "idle" | "saved" }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<PlanField, string[]>> }

// Guarda los datos de un plan. Solo administradoras (también lo exige la RLS).
export async function updatePlan(planId: string, _prev: UpdatePlanState, formData: FormData): Promise<UpdatePlanState> {
  if ((await getAdminView()) !== "admin") {
    return { status: "error", message: "Solo las administradoras pueden editar los planes." }
  }

  const isFree = planId === FREE_PLAN_ID
  const parsed = planSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    price: isFree ? "0" : (formData.get("price")?.toString() ?? ""),
    features: formData.get("features")?.toString() ?? "",
  })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }
  if (!isFree && parsed.data.price === 0) {
    return { status: "error", fieldErrors: { price: ["Un plan pago tiene que tener un precio mayor a 0"] } }
  }

  const { name, description, price, features } = parsed.data
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("plans")
    .update({ name, description, price_ars: price, features })
    .eq("id", planId)
    .select("id")
  // Sin permiso la base no da error: simplemente no actualiza ninguna fila
  if (error || !data.length) {
    if (error) console.error("[updatePlan]", error.code, error.message)
    return { status: "error", message: "No pudimos guardar los cambios. Volvé a intentar." }
  }

  refresh()
  return { status: "saved" }
}
