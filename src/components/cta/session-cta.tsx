import { Suspense } from "react"

import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { getCurrentUser } from "@/lib/supabase/user"

type CtaTarget = { href: string; label: React.ReactNode }

type SessionCtaProps = {
  // Visitante sin sesión
  guest: CtaTarget
  // Usuaria con sesión iniciada
  member: CtaTarget
  id?: string
  className?: string
  tone?: "default" | "brand"
}

async function ResolvedCta({ guest, member, ...props }: SessionCtaProps) {
  const target = (await getCurrentUser()) ? member : guest
  return (
    <ShimmerLink {...props} href={target.href}>
      {target.label}
    </ShimmerLink>
  )
}

// CTA principal que cambia de destino según haya sesión iniciada o no.
// Mientras se resuelve la sesión muestra la versión de visitante (la que ven los buscadores).
export function SessionCta(props: SessionCtaProps) {
  const { guest, id, className, tone } = props
  return (
    <Suspense
      fallback={
        <ShimmerLink id={id} href={guest.href} className={className} tone={tone}>
          {guest.label}
        </ShimmerLink>
      }
    >
      <ResolvedCta {...props} />
    </Suspense>
  )
}
