import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { FloatingCta } from "@/components/cta/floating-cta"
import { JOIN_HREF, JOIN_LABEL } from "@/config/navigation"

type RegisterCtaProps = {
  id?: string
  className?: string
  // Texto, si hace falta otro distinto del oficial
  label?: string
}

// CTA principal del sitio: "Sumate a MX+" a Membresía, igual con o sin sesión iniciada.
export function RegisterCta({ id, className, label = JOIN_LABEL }: RegisterCtaProps) {
  return (
    <ShimmerLink id={id} href={JOIN_HREF} className={className}>
      {label}
    </ShimmerLink>
  )
}

type FloatingRegisterCtaProps = { watchId: string; hideWhileVisibleId?: string }

// Botón flotante "Sumate a MX+" en celular. Aparece cuando el CTA con id `watchId` (normalmente el del
// hero) quedó arriba, fuera de la pantalla.
export function FloatingRegisterCta({ watchId, hideWhileVisibleId }: FloatingRegisterCtaProps) {
  return <FloatingCta href={JOIN_HREF} label={JOIN_LABEL} watchId={watchId} hideWhileVisibleId={hideWhileVisibleId} />
}
