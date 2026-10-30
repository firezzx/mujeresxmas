import { Suspense } from "react"

import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { FloatingCta } from "@/components/cta/floating-cta"
import { ROUTES } from "@/config/navigation"
import { getCurrentUser } from "@/lib/supabase/user"

type RegisterCtaProps = { id?: string; className?: string }

const REGISTER_LABEL = "Registrarme en Mujeres x Más"

function GuestCta({ id, className }: RegisterCtaProps) {
  return (
    <ShimmerLink id={id} href={ROUTES.registro} className={className}>
      {REGISTER_LABEL}
    </ShimmerLink>
  )
}

async function SessionCta(props: RegisterCtaProps) {
  const user = await getCurrentUser()
  if (!user) return <GuestCta {...props} />
  return (
    <ShimmerLink id={props.id} href={ROUTES.miCuenta} className={props.className}>
      Ir a mi cuenta
    </ShimmerLink>
  )
}

// CTA principal: "Registrarme" para visitantes y "Ir a mi cuenta" con sesión iniciada.
// Mientras se resuelve la sesión muestra la versión de visitante (la que ven los buscadores).
export function RegisterCta(props: RegisterCtaProps) {
  return (
    <Suspense fallback={<GuestCta {...props} />}>
      <SessionCta {...props} />
    </Suspense>
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
