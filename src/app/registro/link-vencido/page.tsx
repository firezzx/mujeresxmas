import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { ResendConfirmationForm } from "@/components/auth/resend-confirmation-form"

export const metadata: Metadata = {
  title: "El link venció",
  robots: { index: false },
}

// Destino cuando el link del correo ya se usó, venció o está incompleto.
export default function LinkVencidoPage() {
  return (
    <AuthShell
      title="Este link ya no funciona"
      description="Puede que haya vencido (dura 1 hora) o que ya lo hayas usado. Si tu cuenta todavía no está confirmada, pedí un correo nuevo."
    >
      <ResendConfirmationForm />
    </AuthShell>
  )
}
