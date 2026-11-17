"use server"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

export type UnsubscribeState = { status: "idle" | "done" | "invalid" }

// Baja de los correos masivos con el token del link del correo.
export async function unsubscribe(_prev: UnsubscribeState, formData: FormData): Promise<UnsubscribeState> {
  const token = z.uuid().safeParse(formData.get("token"))
  if (!token.success) return { status: "invalid" }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("unsubscribe_material_lead", { token: token.data })
  if (error) console.error("[unsubscribe]", error.code, error.message)
  return { status: data === true ? "done" : "invalid" }
}
