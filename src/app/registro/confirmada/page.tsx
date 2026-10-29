import type { Metadata } from "next"
import { BadgeCheck } from "lucide-react"

import { AuthShell } from "@/components/auth/auth-shell"
import { ShimmerLink } from "@/components/buttons/shimmer-link"

export const metadata: Metadata = {
  title: "Cuenta confirmada",
  robots: { index: false },
}

// Destino después de confirmar el correo. La sesión ya quedó iniciada en /auth/confirm.
export default function CuentaConfirmadaPage() {
  return (
    <AuthShell
      title={
        <>
          ¡Ya sos parte de Mujeres <span className="text-brand">x</span> Más!
        </>
      }
      description="Confirmamos tu correo y tu cuenta está activa."
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft">
          <BadgeCheck className="size-6" strokeWidth={1.75} />
        </span>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Ya iniciaste sesión. Tu membresía Gratis quedó activada.
        </p>
        <ShimmerLink href="/" size="md" className="h-12 w-full">
          Ir al inicio
        </ShimmerLink>
      </div>
    </AuthShell>
  )
}
