import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { CoverUploader } from "@/components/account/cover-uploader"
import { ProfileCover } from "@/components/account/profile-cover"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BandBackdrop, PAGE_WIDTH_CLASS } from "@/components/page-band"
import { ROUTES } from "@/config/navigation"
import { getAccountSummary, getEditableProfile } from "@/lib/account"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Editar perfil",
  robots: { index: false },
}

// Perfil: foto de portada a todo el ancho, desde arriba de todo (el menú queda encima). Sin foto,
// el verde de marca con textura. Debajo, la foto de perfil montada sobre su borde y los datos.
export default function PerfilPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <Suspense
        fallback={
          <div aria-hidden>
            <div className="relative h-60 sm:h-72 lg:h-80">
              <BandBackdrop tone="green" />
            </div>
            <div className={cn(PAGE_WIDTH_CLASS, "flex flex-col gap-10 pb-20 md:pb-28")}>
              <div className="relative -mt-16 size-28 animate-pulse rounded-lg bg-foreground/[0.06] sm:-mt-20 sm:size-36" />
              <div className="h-[420px] animate-pulse rounded-xl bg-foreground/[0.04]" />
            </div>
          </div>
        }
      >
        <ProfileEditor />
      </Suspense>
    </main>
  )
}

async function ProfileEditor() {
  const [profile, summary] = await Promise.all([getEditableProfile(), getAccountSummary()])
  if (!profile || !summary) redirect(`${ROUTES.login}?next=${ROUTES.perfil}`)

  return (
    <>
      <CoverUploader userId={summary.user.id} coverUrl={profile.coverUrl} fallback={<BandBackdrop tone="green" />}>
        <div className={cn(PAGE_WIDTH_CLASS, "pt-24 sm:pt-28")}>
          <IconHoverArea className="inline-flex">
            <Link
              href={ROUTES.miCuenta}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-background/85 px-3 text-sm font-medium shadow-sm backdrop-blur transition-colors hover:bg-background"
            >
              <HoverIcon name="arrow-left" size={16} />
              Mi cuenta
            </Link>
          </IconHoverArea>
        </div>
      </CoverUploader>

      <div className={cn(PAGE_WIDTH_CLASS, "relative pb-20 md:pb-28")}>
        <ProfileCover summary={summary} values={profile.values} />
      </div>
    </>
  )
}
