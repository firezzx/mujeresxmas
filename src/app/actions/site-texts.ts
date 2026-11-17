"use server"

import { refresh } from "next/cache"
import { z } from "zod"

import { getAdminView } from "@/lib/admin"
import { SIGNUP_INTRO_KEY } from "@/lib/site-texts"
import { createClient } from "@/lib/supabase/server"
import { type SignupIntroField, signupIntroSchema } from "@/lib/validations/site-text"

export type SignupIntroState =
  | { status: "idle" | "saved" }
  | { status: "error"; message?: string; fieldErrors?: Partial<Record<SignupIntroField, string[]>> }

// Guarda la presentación de /sumate. Solo administradoras (también lo exige la RLS).
export async function saveSignupIntro(_prev: SignupIntroState, formData: FormData): Promise<SignupIntroState> {
  if ((await getAdminView()) !== "admin") {
    return { status: "error", message: "Solo las administradoras pueden editar los textos." }
  }

  const parsed = signupIntroSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    titleHighlight: formData.get("titleHighlight")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    bullets: (formData.get("bullets")?.toString() ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("site_texts")
    .upsert({ key: SIGNUP_INTRO_KEY, content: parsed.data, updated_at: new Date().toISOString() })
  if (error) {
    console.error("[saveSignupIntro]", error.code, error.message)
    return { status: "error", message: "No pudimos guardar los textos. Revisá que la migración esté cargada." }
  }

  refresh()
  return { status: "saved" }
}
