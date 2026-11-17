import type { Metadata } from "next"
import { Suspense } from "react"

import { UnsubscribeForm } from "@/components/sumate/unsubscribe-form"
import { HeroLights, ScreenSection } from "@/components/landing/screen"

export const metadata: Metadata = {
  title: "Darme de baja",
  robots: { index: false },
}

// Baja de los correos masivos: el link de cada correo trae el token de esa persona (?t=…).
export default function Page({ searchParams }: PageProps<"/baja">) {
  return (
    <main data-standalone-page className="relative flex flex-1 flex-col">
      <ScreenSection backdrop={<HeroLights />} innerClassName="pt-32 lg:pt-24">
        <Suspense
          fallback={<div aria-hidden className="mx-auto h-64 max-w-lg animate-pulse rounded-xl bg-foreground/[0.04]" />}
        >
          <Unsubscribe searchParams={searchParams} />
        </Suspense>
      </ScreenSection>
    </main>
  )
}

async function Unsubscribe({ searchParams }: Pick<PageProps<"/baja">, "searchParams">) {
  const { t } = await searchParams
  const token = Array.isArray(t) ? t[0] : t
  return <UnsubscribeForm token={token ?? null} />
}
