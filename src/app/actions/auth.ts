"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { ROUTES } from "@/config/navigation"
import { getRequestOrigin } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"
import { emailSchema, HONEYPOT_FIELD, signUpSchema } from "@/lib/validations/auth"

export type SignUpState =
  | { status: "idle" }
  | {
      status: "error"
      message?: string
      fieldErrors?: { email?: string[]; password?: string[] }
    }
  | { status: "success"; email: string }

// Mensajes para los errores de Supabase Auth que la usuaria puede resolver.
// https://supabase.com/docs/guides/auth/debugging/error-codes
const AUTH_ERRORS: Record<string, string> = {
  over_email_send_rate_limit:
    "Enviamos demasiados correos en poco tiempo. Esperá unos minutos y volvé a intentar.",
  over_request_rate_limit:
    "Hubo demasiados intentos seguidos. Esperá unos minutos y volvé a intentar.",
  weak_password:
    "Esa contraseña es muy fácil de adivinar. Probá con otra más larga o combinada.",
  email_address_invalid: "Ese correo no es válido. Revisalo e intentá de nuevo.",
  email_address_not_authorized:
    "Por ahora no podemos enviar correos a esa dirección. Escribinos y lo resolvemos.",
  signup_disabled: "El registro está pausado en este momento. Volvé a intentar más tarde.",
}

const GENERIC_ERROR = "No pudimos crear tu cuenta. Volvé a intentar en unos minutos."

export async function signUp(
  _prev: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  // Campo trampa invisible (con un nombre que el autocompletado no reconoce): si viene
  // completo es un bot, y se le responde como si nada.
  if (formData.get(HONEYPOT_FIELD)) return { status: "success", email: "" }

  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { email, password } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${await getRequestOrigin()}${ROUTES.authConfirm}` },
  })

  // Si el correo ya tenía cuenta, Supabase responde igual que con uno nuevo (no revela
  // qué correos están registrados) y nosotros mostramos el mismo mensaje.
  if (error) {
    console.error("[signUp]", error.code, error.message)
    return { status: "error", message: AUTH_ERRORS[error.code ?? ""] ?? GENERIC_ERROR }
  }

  return { status: "success", email }
}

export type ResendState = { status: "idle" | "sent" | "error"; message?: string }

export async function resendConfirmation(
  _prev: ResendState,
  formData: FormData
): Promise<ResendState> {
  const parsed = emailSchema.safeParse(formData.get("email"))
  if (!parsed.success) return { status: "error", message: "Revisá el correo e intentá de nuevo." }

  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data,
    options: { emailRedirectTo: `${await getRequestOrigin()}${ROUTES.authConfirm}` },
  })

  if (error) {
    console.error("[resendConfirmation]", error.code, error.message)
    return {
      status: "error",
      message: AUTH_ERRORS[error.code ?? ""] ?? "No pudimos reenviar el correo. Probá en unos minutos.",
    }
  }
  return { status: "sent" }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
