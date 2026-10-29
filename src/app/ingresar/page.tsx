import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Ingresá a tu cuenta de Mujeres x Más.",
}

export default function IngresarPage() {
  return (
    <AuthShell eyebrow="Mujeres x Más" title="Qué bueno verte" description="Ingresá con tu correo y tu contraseña.">
      <SignInForm />
    </AuthShell>
  )
}
