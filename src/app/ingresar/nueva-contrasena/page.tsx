import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { BrandHighlight } from "@/components/page-hero"
import { NewPasswordForm } from "@/components/auth/new-password-form"

export const metadata: Metadata = {
  title: "Contraseña nueva",
  robots: { index: false },
}

// Se llega desde el link del correo de recuperación, que ya inició la sesión en /auth/confirm.
export default function NuevaContrasenaPage() {
  return (
    <AuthShell
      title={
        <>
          Elegí <BrandHighlight>tu contraseña nueva</BrandHighlight>
        </>
      }
      description="Usá una que no hayas usado antes en otros sitios."
    >
      <NewPasswordForm />
    </AuthShell>
  )
}
