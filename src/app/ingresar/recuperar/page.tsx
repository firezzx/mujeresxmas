import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { BrandHighlight } from "@/components/page-hero"
import { PasswordResetRequestForm } from "@/components/auth/password-reset-request-form"

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false },
}

export default function RecuperarPage() {
  return (
    <AuthShell
      title={
        <>
          ¿Olvidaste <BrandHighlight>tu contraseña?</BrandHighlight>
        </>
      }
      description="Escribí tu correo y te mandamos un link para elegir una nueva."
    >
      <PasswordResetRequestForm />
    </AuthShell>
  )
}
