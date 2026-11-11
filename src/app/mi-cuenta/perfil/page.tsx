import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { AccountCard } from "@/components/account/account-card"
import { AvatarUploader } from "@/components/account/avatar-uploader"
import { ProfileForm } from "@/components/account/profile-form"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { PageIntro } from "@/components/landing/screen"
import { PAGE_WIDTH_CLASS } from "@/components/page-band"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import { getEditableProfile } from "@/lib/account"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Editar perfil",
  robots: { index: false },
}

export default function PerfilPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <PageIntro
        eyebrow={
          <IconHoverArea className="inline-flex">
            <Link
              href={ROUTES.miCuenta}
              className="inline-flex items-center gap-1.5 text-sm font-medium opacity-80 transition-opacity hover:opacity-100"
            >
              <HoverIcon name="arrow-left" size={16} />
              Mi cuenta
            </Link>
          </IconHoverArea>
        }
        title={
          <>
            Editá <span className="text-brand-green-strong">tus datos</span>
          </>
        }
        description="Así te van a conocer en la comunidad. Podés cambiarlos cuando quieras."
      />

      <div className={cn(PAGE_WIDTH_CLASS, "pb-20 md:pb-28")}>
        <div className="max-w-3xl">
          <Suspense fallback={<div aria-hidden className="h-[520px] animate-pulse rounded-xl bg-foreground/[0.04]" />}>
            <ProfileEditor />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

async function ProfileEditor() {
  const profile = await getEditableProfile()
  if (!profile) redirect(`${ROUTES.login}?next=${ROUTES.perfil}`)

  return (
    <BlurFade delay={0.25} inView>
      <AccountCard className="flex flex-col gap-7">
        <AvatarUploader user={profile.user} />
        <div className="h-px bg-border/70" />
        <ProfileForm initialValues={profile.values} />
      </AccountCard>
    </BlurFade>
  )
}
