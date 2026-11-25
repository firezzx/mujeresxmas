import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthShell } from "@/components/auth/auth-shell"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon } from "@/components/icons/hover-icon"
import { ActivateKiero } from "@/components/kiero/activate-kiero"
import { BrandHighlight } from "@/components/page-hero"
import { JOIN_LABEL, ROUTES } from "@/config/navigation"
import { getAccountSummary } from "@/lib/account"
import { formatDay } from "@/lib/format"
import { isKieroLive, kieroInviteUrl } from "@/lib/kiero"
import { getKieroAccount, kieroStatusLabel } from "@/lib/kiero-accounts"

export const metadata: Metadata = {
  title: "Activar Kiero",
  robots: { index: false },
}

// Activación de Kiero, la tienda online incluida en el plan Crecer. Es privada: sin sesión, el
// proxy manda al login y después vuelve acá.
export default function KieroSolicitudPage() {
  return (
    <AuthShell
      eyebrow="Kiero"
      title={
        <>
          Tu tienda online, <BrandHighlight>en Kiero</BrandHighlight>
        </>
      }
      description="Kiero es la plataforma de e-commerce para tu negocio. Viene incluida en el plan Crecer."
    >
      <Suspense fallback={<div aria-hidden className="h-64 animate-pulse rounded-lg bg-foreground/[0.04]" />}>
        <KieroStatus />
      </Suspense>
    </AuthShell>
  )
}

function Panel({
  icon,
  tone = "brand",
  title,
  text,
  children,
}: {
  icon: React.ComponentProps<typeof HoverIcon>["name"]
  tone?: React.ComponentProps<typeof IconBadge>["tone"]
  title: string
  text: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <IconBadge size="lg" tone={tone}>
        <HoverIcon name={icon} size={24} autoPlay />
      </IconBadge>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl font-semibold tracking-[-0.01em]">{title}</h2>
        <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">{text}</p>
      </div>
      <div className="flex w-full flex-col gap-3">{children}</div>
      {!isKieroLive() && <TestModeNote />}
    </div>
  )
}

// Aviso de que todavía no se usa la API real: el alta y la baja son simuladas
function TestModeNote() {
  return (
    <p className="inline-flex items-center gap-2 rounded-md bg-foreground/[0.05] px-3 py-1.5 text-xs text-muted-foreground">
      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
      Modo prueba: todavía no se conecta con Kiero
    </p>
  )
}

async function KieroStatus() {
  const summary = await getAccountSummary()
  if (!summary) return null
  const account = await getKieroAccount(summary.user.id)
  const hasPaidPlan = (summary.membership?.planPriceArs ?? 0) > 0
  const back = (
    <HoverRevealLink href={ROUTES.kiero} className="w-full">
      Volver a Kiero
    </HoverRevealLink>
  )

  // Ya tiene cuenta (o invitación) vigente
  if (account && !account.canceledAt) {
    const inviteUrl = kieroInviteUrl(account.invitationToken)
    const expires = account.invitationExpiresAt
      ? ` La invitación vence el ${formatDay(account.invitationExpiresAt)}.`
      : ""
    return (
      <Panel
        icon="check-check"
        tone="green"
        title={kieroStatusLabel(account)}
        text={
          <>
            Tu tienda está asociada a <strong className="font-medium text-foreground">{account.email}</strong>.{expires}
          </>
        }
      >
        {inviteUrl && (
          <ShimmerLink href={inviteUrl} size="md" className="h-12 w-full">
            Aceptar la invitación
          </ShimmerLink>
        )}
        {back}
      </Panel>
    )
  }

  // Tiene Crecer: puede activarla (o volver a activarla si la dio de baja)
  if (hasPaidPlan) {
    return (
      <Panel
        icon="rocket"
        title={account ? "Volvé a activar tu tienda" : "Activá tu tienda"}
        text={
          <>
            Te damos de alta en Kiero con tu correo{" "}
            <strong className="font-medium text-foreground">{summary.user.email}</strong>.
          </>
        }
      >
        <ActivateKiero label="Activar mi tienda en Kiero" />
        {back}
      </Panel>
    )
  }

  // Sin plan pago
  return (
    <Panel
      icon="sparkles"
      title="Kiero viene con el plan Crecer"
      text="Pasate a Crecer para tener tu tienda online, la guía para activarla y los talleres de ventas."
    >
      <ShimmerLink href={ROUTES.membresia} size="md" className="h-12 w-full">
        {JOIN_LABEL}
      </ShimmerLink>
      {back}
    </Panel>
  )
}
