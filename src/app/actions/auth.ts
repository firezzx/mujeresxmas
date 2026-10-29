"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { ROUTES } from "@/config/navigation"
import { getRequestOrigin } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"
import {
  emailSchema,
  HONEYPOT_FIELD,
  newPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth"

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

export type SignInState =
  | { status: "idle" }
  | {
      status: "error"
      message?: string
      fieldErrors?: { email?: string[]; password?: string[] }
      // Correo de una cuenta sin confirmar, para ofrecer reenviar el link
      unconfirmedEmail?: string
    }

const INVALID_CREDENTIALS = "El correo o la contraseña no coinciden. Revisalos e intentá de nuevo."

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (formData.get(HONEYPOT_FIELD)) return { status: "error", message: INVALID_CREDENTIALS }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        status: "error",
        message: "Todavía no confirmaste tu correo. Buscá el link que te enviamos o pedí uno nuevo.",
        unconfirmedEmail: parsed.data.email,
      }
    }
    // Mismo mensaje si el correo no existe o la contraseña está mal: no revela qué cuentas hay
    if (error.code === "invalid_credentials") return { status: "error", message: INVALID_CREDENTIALS }
    console.error("[signIn]", error.code, error.message)
    return {
      status: "error",
      message: AUTH_ERRORS[error.code ?? ""] ?? "No pudimos iniciar sesión. Volvé a intentar en unos minutos.",
    }
  }

  redirect("/")
}

export type PasswordResetState = { status: "idle" | "sent" | "error"; message?: string; email?: string }

export async function requestPasswordReset(
  _prev: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const parsed = emailSchema.safeParse(formData.get("email"))
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message }
  if (formData.get(HONEYPOT_FIELD)) return { status: "sent", email: parsed.data }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await getRequestOrigin()}${ROUTES.authConfirm}?next=${ROUTES.nuevaContrasena}`,
  })

  // Solo se informan los errores que la usuaria puede resolver. Si el correo no tiene cuenta,
  // la respuesta es la misma que si la tuviera.
  if (error) {
    console.error("[requestPasswordReset]", error.code, error.message)
    const message = AUTH_ERRORS[error.code ?? ""]
    if (message) return { status: "error", message }
  }
  return { status: "sent", email: parsed.data }
}

export type UpdatePasswordState =
  | { status: "idle" | "success" }
  | { status: "error"; message?: string; fieldErrors?: { password?: string[] }; expired?: boolean }

export async function updatePassword(
  _prev: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const parsed = newPasswordSchema.safeParse({ password: formData.get("password") })
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const supabase = await createClient()
  // La sesión la abre el link del correo de recuperación (/auth/confirm)
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) {
    return {
      status: "error",
      expired: true,
      message: "El link para cambiar la contraseña venció. Pedí uno nuevo.",
    }
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
  if (error) {
    console.error("[updatePassword]", error.code, error.message)
    if (error.code === "same_password") {
      return { status: "error", message: "La nueva contraseña tiene que ser distinta de la anterior." }
    }
    if (error.code === "reauthentication_needed" || error.code === "session_not_found") {
      return {
        status: "error",
        expired: true,
        message: "Por seguridad necesitamos que pidas un link nuevo para cambiar la contraseña.",
      }
    }
    return {
      status: "error",
      message: AUTH_ERRORS[error.code ?? ""] ?? "No pudimos cambiar la contraseña. Volvé a intentar.",
    }
  }

  return { status: "success" }
}
