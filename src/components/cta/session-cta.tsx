import { Suspense } from "react"

import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { getCurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"

type CtaTarget = { href: string; label: React.ReactNode }

type SessionCtaProps = {
  // Visitante sin sesión
  guest: CtaTarget
  // Usuaria con sesión iniciada
  member: CtaTarget
  id?: string
  className?: string
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
// Mientras el servidor confirma la sesión van las dos versiones y se ve la que indica el aviso de
// <html data-session>, así el botón no cambia al llegar la respuesta. Los buscadores ven la de visitante.
export function SessionCta(props: SessionCtaProps) {
  const { guest, member, id, className } = props
  return (
    <Suspense
      fallback={
        <>
          <ShimmerLink id={id} href={guest.href} className={cn("only-guest", className)}>
            {guest.label}
          </ShimmerLink>
          <ShimmerLink href={member.href} className={cn("only-member", className)}>
            {member.label}
          </ShimmerLink>
        </>
      }
    >
      <ResolvedCta {...props} />
    </Suspense>
  )
}
