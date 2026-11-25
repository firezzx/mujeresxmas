import Link from "next/link"

import { AccountCard } from "@/components/account/account-card"
import { AvatarUploader } from "@/components/account/avatar-uploader"
import { ProfileForm } from "@/components/account/profile-form"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { DarkBackdrop } from "@/components/landing/landing-ui"
import { BlurFade } from "@/components/ui/blur-fade"
import { JOIN_LABEL, ROUTES } from "@/config/navigation"
import type { AccountSummary } from "@/lib/account"
import { formatPrice } from "@/lib/format"
import type { ProfileField } from "@/lib/validations/profile"

// Debajo de la portada: la foto montada sobre su borde, con el nombre y el emprendimiento.
// Abajo, la membresía en una tarjeta ancha y un solo formulario con todos los datos.
export function ProfileCover({ summary, values }: { summary: AccountSummary; values: Record<ProfileField, string> }) {
  const { user, membership } = summary
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ")
  const business = values.business_name.trim()

  return (
    <div className="flex flex-col gap-10">
      <AvatarUploader
        user={user}
        variant="cover"
        heading={
          <>
            <h1 className="font-heading text-3xl leading-tight font-semibold tracking-[-0.02em] text-balance break-words sm:text-4xl">
              {fullName || "Tu perfil"}
            </h1>
            {business && <p className="mt-1 text-lg text-muted-foreground">{business}</p>}
          </>
        }
      />

      {/* En pantallas grandes, los datos a la izquierda y la membresía al lado; en el celular, la membresía primero */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <BlurFade delay={0.1} inView className="lg:order-2">
          <MembershipCard membership={membership} />
        </BlurFade>

        <BlurFade delay={0.18} inView className="min-w-0">
          <AccountCard>
            <h2 className="font-heading text-lg font-semibold tracking-[-0.01em]">Tus datos</h2>
            <div className="mt-6">
              <ProfileForm initialValues={values} />
            </div>
          </AccountCard>
        </BlurFade>
      </div>
    </div>
  )
}

// Membresía activa: fondo oscuro para que sea lo primero que se ve debajo de la cabecera.
function MembershipCard({ membership }: { membership: AccountSummary["membership"] }) {
  const price = membership
    ? membership.planPriceArs > 0
      ? `${formatPrice(membership.planPriceArs)} por mes`
      : "Sin costo"
    : null

  return (
    <section className="relative isolate h-full overflow-hidden rounded-xl p-6 text-primary-foreground sm:p-8">
      <DarkBackdrop />
      <div className="relative flex h-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
        <div className="min-w-0">
          <h2 className="text-sm font-medium text-primary-foreground/70">Tu membresía</h2>
          <p className="mt-2 font-heading text-4xl leading-none font-semibold tracking-[-0.01em]">
            {membership?.planName ?? "Sin plan"}
          </p>
          {price && <p className="mt-3 text-sm text-primary-foreground/70">{price}</p>}
          {membership?.planDescription && (
            <p className="mt-2 max-w-xl text-sm text-pretty text-primary-foreground/80">{membership.planDescription}</p>
          )}
        </div>
        <IconHoverArea className="inline-flex shrink-0 lg:mt-auto">
          <Link
            href={ROUTES.membresia}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-strong px-5 py-2 text-sm font-semibold text-white transition-opacity outline-none hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/40 sm:w-auto lg:w-full"
          >
            <HoverIcon name="sparkles" size={16} />
            {JOIN_LABEL}
          </Link>
        </IconHoverArea>
      </div>
    </section>
  )
}
