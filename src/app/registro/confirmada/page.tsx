import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthShell } from "@/components/auth/auth-shell"
import { IconBadge } from "@/components/icon-badge"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { HoverIcon } from "@/components/icons/hover-icon"
import { BrandHighlight } from "@/components/page-hero"
import { Confetti } from "@/components/ui/confetti"
import { CONFETTI_COLORS } from "@/config/brand-effects"
import { ROUTES } from "@/config/navigation"
import { safeInternalPath } from "@/lib/site-url"

export const metadata: Metadata = {
  title: "Cuenta confirmada",
  robots: { index: false },
}

// Texto del botón según a dónde vuelve; cualquier otra ruta usa "Continuar".
const CONTINUE_LABELS: Record<string, string> = {
  [ROUTES.quiero]: "Seguir con QUIERO",
}

// Destino después de confirmar el correo. La sesión ya quedó iniciada en /auth/confirm.
// Si el registro empezó en otra página (?next=, p. ej. QUIERO), el botón lleva de vuelta ahí.
export default function CuentaConfirmadaPage({ searchParams }: PageProps<"/registro/confirmada">) {
  return (
    <AuthShell
      title={
        <>
          ¡Ya sos parte de Mujeres <BrandHighlight>x</BrandHighlight> Más!
        </>
      }
      description="Confirmamos tu correo y tu cuenta está activa."
      // Festejo al llegar: confeti de Magic UI con los colores de la marca
      backdrop={
        <Confetti
          className="pointer-events-none fixed inset-0 z-20 size-full"
          options={{ colors: CONFETTI_COLORS, disableForReducedMotion: true, particleCount: 140, spread: 100, startVelocity: 38, origin: { y: 0.35 } }}
        />
      }
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <IconBadge size="lg" tone="green">
          <HoverIcon name="circle-check" size={24} autoPlay />
        </IconBadge>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Ya iniciaste sesión. Tu membresía Gratis quedó activada.
        </p>
        <Suspense fallback={<ContinueLink href="/" label="Ir al inicio" />}>
          <ContinueCta searchParams={searchParams} />
        </Suspense>
      </div>
    </AuthShell>
  )
}

async function ContinueCta({ searchParams }: Pick<PageProps<"/registro/confirmada">, "searchParams">) {
  const { next } = await searchParams
  const href = safeInternalPath(typeof next === "string" ? next : null, "/")
  if (href === "/") return <ContinueLink href="/" label="Ir al inicio" />
  return <ContinueLink href={href} label={CONTINUE_LABELS[href] ?? "Continuar"} />
}

function ContinueLink({ href, label }: { href: string; label: string }) {
  return (
    <ShimmerLink href={href} size="md" className="h-12 w-full">
      {label}
    </ShimmerLink>
  )
}
