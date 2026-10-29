import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Registrate en Mujeres x Más con tu correo y sumate a la comunidad.",
}

export default function RegistroPage() {
  return (
    <AuthShell
      eyebrow="Registrarme en Mujeres x Más"
      title="Creá tu cuenta"
      description="Solo necesitás tu correo y una contraseña. Después vas a poder completar tu perfil."
    >
      <SignUpForm />
    </AuthShell>
  )
}
