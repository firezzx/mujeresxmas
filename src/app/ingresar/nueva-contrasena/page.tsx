import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { NewPasswordForm } from "@/components/auth/new-password-form"

export const metadata: Metadata = {
  title: "Contraseña nueva",
  robots: { index: false },
}

// Se llega desde el link del correo de recuperación, que ya inició la sesión en /auth/confirm.
export default function NuevaContrasenaPage() {
  return (
    <AuthShell title="Elegí tu contraseña nueva" description="Usá una que no hayas usado antes en otros sitios.">
      <NewPasswordForm />
    </AuthShell>
  )
}
