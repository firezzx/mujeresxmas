import { Suspense } from "react"

import { FloatingCta } from "@/components/cta/floating-cta"
import { SessionCta } from "@/components/cta/session-cta"
import { ROUTES } from "@/config/navigation"
import { getCurrentUser } from "@/lib/supabase/user"

const REGISTER_LABEL = "Registrarme en Mujeres x Más"

type RegisterCtaProps = {
  id?: string
  className?: string
  // Texto para visitantes, si hace falta otro distinto del oficial
  label?: string
}

// CTA principal del sitio: "Registrarme" para visitantes e "Ir a mi cuenta" con sesión iniciada.
export function RegisterCta({ id, className, label = REGISTER_LABEL }: RegisterCtaProps) {
  return (
    <SessionCta
      id={id}
      className={className}
      guest={{ href: ROUTES.registro, label }}
      member={{ href: ROUTES.miCuenta, label: "Ir a mi cuenta" }}
    />
  )
}

type FloatingRegisterCtaProps = { watchId: string; hideWhileVisibleId?: string }

async function GuestFloatingCta({ watchId, hideWhileVisibleId }: FloatingRegisterCtaProps) {
  const user = await getCurrentUser()
  if (user) return null
  return (
    <FloatingCta
      href={ROUTES.registro}
      label={REGISTER_LABEL}
      watchId={watchId}
      hideWhileVisibleId={hideWhileVisibleId}
    />
  )
}

// Botón flotante de registro en celular, solo para visitantes. Aparece cuando el CTA
// con id `watchId` (normalmente el del hero) quedó arriba, fuera de la pantalla.
export function FloatingRegisterCta({ watchId, hideWhileVisibleId }: FloatingRegisterCtaProps) {
  return (
    <Suspense fallback={null}>
      <GuestFloatingCta watchId={watchId} hideWhileVisibleId={hideWhileVisibleId} />
    </Suspense>
  )
}
