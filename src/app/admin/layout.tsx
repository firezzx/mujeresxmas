import { notFound } from "next/navigation"
import { Suspense } from "react"

import { setMemberView } from "@/app/actions/admin"
import NotFound from "@/app/not-found"
import { AdminNav } from "@/components/admin/admin-nav"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { Band, ColorHero } from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { RippleButton } from "@/components/ui/ripple-button"
import { BRAND_HEX } from "@/config/brand-effects"
import { getAdminView } from "@/lib/admin"

const MAIN_CLASS = "relative flex flex-1 flex-col"

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
  // En "Ver como usuario" se muestra la misma 404 pero sin notFound(): así, al volver a la
  // vista de admin desde esta misma URL, la página se vuelve a renderizar.
  if (view === "member") return <NotFound />

  return (
    <main className={MAIN_CLASS}>
      <ColorHero
        tone="ink"
        compact
        eyebrow="Administración"
        title={
          <>
            Panel de <BrandHighlight>la comunidad</BrandHighlight>
          </>
        }
        description="Usuarios, cursos, eventos y avisos de Mujeres x Más en un solo lugar."
        actions={
          <IconHoverArea className="w-fit">
            <form action={setMemberView.bind(null, true)}>
              <RippleButton
                type="submit"
                rippleColor={BRAND_HEX.pink}
                className="inline-flex h-11 items-center rounded-lg border-0 bg-background px-5 text-sm font-medium text-foreground transition-[background-color,box-shadow] duration-300 hover:bg-brand-soft"
              >
                <span className="flex items-center gap-2">
                  <HoverIcon name="eye" size={16} />
                  Ver como usuario
                </span>
              </RippleButton>
            </form>
          </IconHoverArea>
        }
      />

      <Band className="py-4 md:py-5">
        <BlurFade delay={0.24} inView>
          <AdminNav />
        </BlurFade>
      </Band>

      {children}
    </main>
  )
}

function AdminSkeleton() {
  return (
    <div aria-hidden>
      <Band tone="ink" dots className="flex flex-col gap-4 pt-28 pb-14 md:pt-36 md:pb-20">
        <div className="h-7 w-32 animate-pulse rounded-md bg-background/15" />
        <div className="h-12 w-72 max-w-full animate-pulse rounded-lg bg-background/15" />
      </Band>
      <Band className="py-4 md:py-5">
        <div className="h-12 w-full max-w-md animate-pulse rounded-lg bg-foreground/[0.05]" />
      </Band>
      <Band className="py-3">
        <div className="h-96 animate-pulse rounded-xl bg-foreground/[0.04]" />
      </Band>
    </div>
  )
}
