import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { BrandHighlight } from "@/components/page-hero"
import { IconBadge } from "@/components/icon-badge"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { HoverIcon } from "@/components/icons/hover-icon"
import { ROUTES } from "@/config/navigation"

export const metadata: Metadata = {
  title: "Pedir Kiero",
  robots: { index: false },
}

// Pantalla provisoria (función 2): la clienta todavía no definió cómo se pide Kiero.
// Es privada: sin sesión, el proxy manda al login y después vuelve acá.
export default function KieroSolicitudPage() {
  return (
    <AuthShell
      eyebrow="Kiero"
      title={
        <>
          Muy pronto <BrandHighlight>vas a poder pedirlo</BrandHighlight>
        </>
      }
      description="Estamos terminando de preparar todo para que puedas sumarte a Kiero desde acá."
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <IconBadge size="lg">
          <HoverIcon name="sparkles" size={24} autoPlay />
        </IconBadge>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Te vamos a avisar cuando esté listo. Mientras tanto, podés completar tu perfil.
        </p>
        <div className="flex w-full flex-col gap-3">
          <ShimmerLink href={ROUTES.perfil} size="md" className="h-12 w-full">
            Completar mi perfil
          </ShimmerLink>
          <HoverRevealLink href={ROUTES.kiero} className="w-full">
            Volver a Kiero
          </HoverRevealLink>
        </div>
      </div>
    </AuthShell>
  )
}
