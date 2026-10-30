import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthShell } from "@/components/auth/auth-shell"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { HoverIcon } from "@/components/icons/hover-icon"
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
          ¡Ya sos parte de Mujeres <span className="text-brand">x</span> Más!
        </>
      }
      description="Confirmamos tu correo y tu cuenta está activa."
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-soft">
          <HoverIcon name="circle-check" size={24} autoPlay />
        </span>
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
