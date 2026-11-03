import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { AccountCard } from "@/components/account/account-card"
import { AvatarUploader } from "@/components/account/avatar-uploader"
import { ProfileForm } from "@/components/account/profile-form"
import { GridSection, HeroGlow } from "@/components/grid-section"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { BrandHighlight, Eyebrow } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import { getEditableProfile } from "@/lib/account"

export const metadata: Metadata = {
  title: "Editar perfil",
  robots: { index: false },
}

export default function PerfilPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      <GridSection first>
        <header className="relative overflow-hidden px-5 pt-28 pb-10 sm:px-10 md:pt-36 md:pb-14">
          <HeroGlow />
          <div className="relative mx-auto flex max-w-2xl flex-col items-start gap-4">
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
                Editá <BrandHighlight>tus datos</BrandHighlight>
              </h1>
            </BlurFade>
            <BlurFade delay={0.2} inView>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Así te van a conocer en la comunidad. Podés cambiarlos cuando quieras.
              </p>
            </BlurFade>
          </div>
        </header>
      </GridSection>

      <GridSection>
        <div className="mx-auto max-w-2xl border-border md:border-x">
          <Suspense fallback={<div aria-hidden className="h-[520px] animate-pulse bg-foreground/[0.03]" />}>
            <ProfileEditor />
          </Suspense>
        </div>
      </GridSection>
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
