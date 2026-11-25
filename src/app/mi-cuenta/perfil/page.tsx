import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { ProfileCover } from "@/components/account/profile-cover"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BandBackdrop, PAGE_WIDTH_CLASS } from "@/components/page-band"
import { ROUTES } from "@/config/navigation"
import { getEditableProfile } from "@/lib/account"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Editar perfil",
  robots: { index: false },
}

const DESCRIPTION = "Así te van a conocer en la comunidad. Podés cambiarlos cuando quieras."

// Portada de perfil: banner verde con textura a todo el ancho, desde arriba de todo (el menú queda
// encima), con la vuelta a Mi cuenta. Debajo, la foto montada sobre su borde y el formulario.
export default function PerfilPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <div className="relative h-60 sm:h-72 lg:h-80">
        <BandBackdrop tone="green" />
        <div className={cn(PAGE_WIDTH_CLASS, "relative pt-24 sm:pt-28")}>
          <IconHoverArea className="inline-flex">
            <Link
              href={ROUTES.miCuenta}
              className="inline-flex items-center gap-1.5 text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
            >
              <HoverIcon name="arrow-left" size={16} />
              Mi cuenta
            </Link>
          </IconHoverArea>
        </div>
      </div>

      <div className={cn(PAGE_WIDTH_CLASS, "relative pb-20 md:pb-28")}>
        <Suspense
          fallback={
            <div aria-hidden className="flex flex-col gap-10">
              <div className="-mt-16 size-28 animate-pulse rounded-lg bg-foreground/[0.06] sm:-mt-20 sm:size-36" />
              <div className="h-[420px] animate-pulse rounded-xl bg-foreground/[0.04]" />
            </div>
          }
        >
          <ProfileEditor />
        </Suspense>
      </div>
    </main>
  )
}

async function ProfileEditor() {
  const profile = await getEditableProfile()
  if (!profile) redirect(`${ROUTES.login}?next=${ROUTES.perfil}`)

  return <ProfileCover user={profile.user} values={profile.values} description={DESCRIPTION} />
}
