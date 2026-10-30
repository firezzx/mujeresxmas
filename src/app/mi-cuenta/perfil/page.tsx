import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { AccountCard } from "@/components/account/account-card"
import { AvatarUploader } from "@/components/account/avatar-uploader"
import { ProfileForm } from "@/components/account/profile-form"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { Eyebrow } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import { getEditableProfile } from "@/lib/account"

export const metadata: Metadata = {
  title: "Editar perfil",
  robots: { index: false },
}

export default function PerfilPage() {
  return (
    <main className="relative mx-auto w-full max-w-2xl flex-1 px-4 pt-28 pb-20 sm:px-6 md:pt-36">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col items-start gap-4">
          <BlurFade delay={0.05} inView>
            <IconHoverArea className="inline-flex">
              <Link
                href={ROUTES.miCuenta}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <HoverIcon name="arrow-left" size={16} />
                Mi cuenta
              </Link>
            </IconHoverArea>
          </BlurFade>
          <BlurFade delay={0.1} inView>
            <Eyebrow>Tu perfil</Eyebrow>
          </BlurFade>
          <BlurFade delay={0.15} inView>
            <h1 className="font-heading text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-5xl">
              Editá tus datos
            </h1>
          </BlurFade>
          <BlurFade delay={0.2} inView>
            <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Así te van a conocer en la comunidad. Podés cambiarlos cuando quieras.
            </p>
          </BlurFade>
        </header>

        <Suspense
          fallback={<div aria-hidden className="h-[520px] animate-pulse rounded-[28px] bg-foreground/[0.05]" />}
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
