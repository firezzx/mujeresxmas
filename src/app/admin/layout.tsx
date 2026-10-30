import { notFound } from "next/navigation"
import { Suspense } from "react"

import { setMemberView } from "@/app/actions/admin"
import NotFound from "@/app/not-found"
import { AdminNav } from "@/components/admin/admin-nav"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { Eyebrow, PAGE_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { RippleButton } from "@/components/ui/ripple-button"
import { BRAND_HEX } from "@/config/brand-effects"
import { getAdminView } from "@/lib/admin"

const MAIN_CLASS = "relative mx-auto w-full max-w-5xl flex-1 px-4 pt-28 pb-20 sm:px-6 md:pt-36"

// Estructura común del panel: verifica el acceso una sola vez y muestra encabezado y pestañas.
// Cada sección (usuarias, cursos, eventos, notificaciones) es una página dentro de /admin.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense
      fallback={
        <main className={MAIN_CLASS}>
          <AdminSkeleton />
        </main>
      }
    >
      <AdminGate>{children}</AdminGate>
    </Suspense>
  )
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  const view = await getAdminView()
  // Para quien no es administradora el panel no existe
  if (!view) notFound()
  // En "Ver como usuaria" se muestra la misma 404 pero sin notFound(): así, al volver a la
  // vista de admin desde esta misma URL, la página se vuelve a renderizar.
  if (view === "member") return <NotFound />

  return (
    <main className={MAIN_CLASS}>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4">
            <BlurFade delay={0.05} inView>
              <Eyebrow>Administración</Eyebrow>
            </BlurFade>
            <PageTitle delay={0.12} className={PAGE_TITLE_CLASS}>
              Panel de la comunidad
            </PageTitle>
            <BlurFade delay={0.19} inView>
              <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                Usuarias, cursos, eventos y avisos de Mujeres x Más en un solo lugar.
              </p>
            </BlurFade>
          </div>
          <BlurFade delay={0.19} inView>
            <IconHoverArea>
              <form action={setMemberView.bind(null, true)}>
                <RippleButton
                  type="submit"
                  rippleColor={BRAND_HEX.light}
                  className="inline-flex h-11 items-center rounded-full border-0 bg-transparent px-5 text-sm font-medium text-foreground ring-1 ring-border transition-[background-color,box-shadow] duration-300 hover:bg-foreground/[0.04] hover:ring-foreground/20"
                >
                  <span className="flex items-center gap-2">
                    <HoverIcon name="eye" size={16} />
                    Ver como usuaria
                  </span>
                </RippleButton>
              </form>
            </IconHoverArea>
          </BlurFade>
        </header>

        <BlurFade delay={0.24} inView>
          <AdminNav />
        </BlurFade>

        {children}
      </div>
    </main>
  )
}

function AdminSkeleton() {
  const block = "animate-pulse rounded-[28px] bg-foreground/[0.05]"
  return (
    <div aria-hidden className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="h-7 w-32 animate-pulse rounded-full bg-foreground/[0.05]" />
        <div className="h-12 w-72 animate-pulse rounded-2xl bg-foreground/[0.06]" />
      </div>
      <div className="h-12 w-full max-w-md animate-pulse rounded-full bg-foreground/[0.05]" />
      <div className={`${block} h-96`} />
    </div>
  )
}
