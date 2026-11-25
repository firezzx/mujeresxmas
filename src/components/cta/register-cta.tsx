import { Suspense } from "react"

import { FloatingCta } from "@/components/cta/floating-cta"
import { SessionCta } from "@/components/cta/session-cta"
import { JOIN_HREF, JOIN_LABEL, ROUTES } from "@/config/navigation"
import { getCurrentUser } from "@/lib/supabase/user"

type RegisterCtaProps = {
  id?: string
  className?: string
  // Texto para visitantes, si hace falta otro distinto del oficial
  label?: string
}

// CTA principal del sitio: "Sumate a MX+" (a los planes, para elegir cómo sumarse) para visitantes
// e "Ir a mi cuenta" con sesión iniciada.
export function RegisterCta({ id, className, label = JOIN_LABEL }: RegisterCtaProps) {
  return (
    <SessionCta
      id={id}
      className={className}
      guest={{ href: JOIN_HREF, label }}
      member={{ href: ROUTES.miCuenta, label: "Ir a mi cuenta" }}
    />
  )
}

type FloatingRegisterCtaProps = { watchId: string; hideWhileVisibleId?: string }

async function GuestFloatingCta({ watchId, hideWhileVisibleId }: FloatingRegisterCtaProps) {
  const user = await getCurrentUser()
  if (user) return null
  return <FloatingCta href={JOIN_HREF} label={JOIN_LABEL} watchId={watchId} hideWhileVisibleId={hideWhileVisibleId} />
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
