import type { Metadata } from "next"
import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { ResendConfirmationForm } from "@/components/auth/resend-confirmation-form"
import { ROUTES } from "@/config/navigation"

export const metadata: Metadata = {
  title: "El link venció",
  robots: { index: false },
}

// Destino cuando el link de un correo (confirmación o recuperación) ya se usó, venció o está incompleto.
export default function LinkVencidoPage() {
  return (
    <AuthShell
      title="Este link ya no funciona"
      description="Puede que haya vencido (dura 1 hora) o que ya lo hayas usado. Pedí uno nuevo y usá siempre el último que te llegue."
    >
      <p className="mb-4 text-sm font-medium">¿Estabas confirmando tu cuenta?</p>
      <ResendConfirmationForm />
      <p className="mt-2 border-t border-border/70 pt-5 text-center text-sm text-muted-foreground">
        ¿Querías cambiar tu contraseña?{" "}
        <Link href={ROUTES.recuperar} className="font-medium text-foreground underline-offset-4 hover:underline">
          Pedí un link nuevo
        </Link>
      </p>
    </AuthShell>
  )
}
