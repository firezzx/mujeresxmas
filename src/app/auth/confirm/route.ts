import type { EmailOtpType, User } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { after, type NextRequest } from "next/server"

import { ROUTES } from "@/config/navigation"
import { WELCOME_EMAIL } from "@/content/correos"
import { isEmailConfigured, sendEmails, welcomeEmail } from "@/lib/email"
import { safeInternalPath } from "@/lib/site-url"
import { createClient } from "@/lib/supabase/server"

const OTP_TYPES: EmailOtpType[] = ["signup", "email", "recovery", "email_change", "invite", "magiclink"]
// Links que confirman una cuenta nueva: después de verificarlos sale el correo de bienvenida
const SIGNUP_TYPES: EmailOtpType[] = ["signup", "email", "invite"]

// Bienvenida por correo, después de redirigir (no demora a la usuaria). Solo si el envío está configurado.
function sendWelcome(user: User | null, origin: string) {
  if (!user?.email || !isEmailConfigured()) return
  const to = user.email
  after(async () => {
    const message = welcomeEmail({ copy: WELCOME_EMAIL, siteUrl: origin, accountPath: ROUTES.miCuenta })
    const { failed } = await sendEmails([{ to, ...message }])
    if (failed) console.error("[auth/confirm] no salió el correo de bienvenida")
  })
}

// Destino de los links de los correos de Supabase Auth.
// Las plantillas (supabase/templates) mandan token_hash + type, que funciona aunque el link se
// abra en otro navegador o dispositivo. `code` cubre la plantilla por defecto de Supabase (PKCE).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const code = searchParams.get("code")
  const next = safeInternalPath(searchParams.get("next"), ROUTES.cuentaConfirmada)

  const supabase = await createClient()

  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (!error) {
      if (SIGNUP_TYPES.includes(type)) sendWelcome(data.user, origin)
      redirect(next)
    }
    console.error("[auth/confirm]", error.code, error.message)
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) redirect(next)
    console.error("[auth/confirm]", error.code, error.message)
  }

  redirect(ROUTES.linkVencido)
}
