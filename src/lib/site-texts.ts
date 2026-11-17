import { connection } from "next/server"

import { SIGNUP_PAGE } from "@/content/sumate"
import { createClient } from "@/lib/supabase/server"
import { type SignupIntro, signupIntroSchema } from "@/lib/validations/site-text"

// Textos editables desde el panel (tabla site_texts). Si la fila no existe o no se puede leer,
// se usan los textos de src/content, así la página nunca queda vacía.

export const SIGNUP_INTRO_KEY = "sumate"

export const DEFAULT_SIGNUP_INTRO: SignupIntro = {
  title: SIGNUP_PAGE.title,
  titleHighlight: SIGNUP_PAGE.titleHighlight,
  description: SIGNUP_PAGE.description,
  bullets: [...SIGNUP_PAGE.bullets],
}

export async function getSignupIntro(): Promise<SignupIntro> {
  await connection()
  const supabase = await createClient()
  const { data, error } = await supabase.from("site_texts").select("content").eq("key", SIGNUP_INTRO_KEY).maybeSingle()
  if (error) console.error("[getSignupIntro]", error.code, error.message)

  const parsed = signupIntroSchema.safeParse(data?.content)
  return parsed.success ? parsed.data : DEFAULT_SIGNUP_INTRO
}
