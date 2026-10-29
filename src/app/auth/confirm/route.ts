import type { EmailOtpType } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

import { ROUTES } from "@/config/navigation"
import { safeInternalPath } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"

const OTP_TYPES: EmailOtpType[] = ["signup", "email", "recovery", "email_change", "invite", "magiclink"]

// Destino de los links de los correos de Supabase Auth.
// Las plantillas (supabase/templates) mandan token_hash + type, que funciona aunque el link se
// abra en otro navegador o dispositivo. `code` cubre la plantilla por defecto de Supabase (PKCE).
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const code = searchParams.get("code")
  const next = safeInternalPath(searchParams.get("next"), ROUTES.cuentaConfirmada)

  const supabase = await createClient()

  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) redirect(next)
    console.error("[auth/confirm]", error.code, error.message)
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) redirect(next)
    console.error("[auth/confirm]", error.code, error.message)
  }

  redirect(ROUTES.linkVencido)
}
