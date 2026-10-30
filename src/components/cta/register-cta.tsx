import { Suspense } from "react"

import { FloatingCta } from "@/components/cta/floating-cta"
import { SessionCta } from "@/components/cta/session-cta"
import { ROUTES } from "@/config/navigation"
import { getCurrentUser } from "@/lib/supabase/user"

const REGISTER_LABEL = "Registrarme en Mujeres x Más"

// CTA principal del sitio: "Registrarme" para visitantes e "Ir a mi cuenta" con sesión iniciada.
export function RegisterCta({ id, className }: { id?: string; className?: string }) {
  return (
    <SessionCta
      id={id}
      className={className}
      guest={{ href: ROUTES.registro, label: REGISTER_LABEL }}
      member={{ href: ROUTES.miCuenta, label: "Ir a mi cuenta" }}
    />
  )
}

async function GuestFloatingCta({ watchId }: { watchId: string }) {
  const user = await getCurrentUser()
  if (user) return null
  return <FloatingCta href={ROUTES.registro} label={REGISTER_LABEL} watchId={watchId} />
}

// Botón flotante de registro en celular, solo para visitantes. Aparece cuando el CTA
// con id `watchId` (normalmente el del hero) quedó arriba, fuera de la pantalla.
export function FloatingRegisterCta({ watchId }: { watchId: string }) {
  return (
    <Suspense fallback={null}>
      <GuestFloatingCta watchId={watchId} />
    </Suspense>
  )
}
