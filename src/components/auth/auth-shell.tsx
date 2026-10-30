import { BrandCard } from "@/components/account/account-card"
import { Eyebrow, PAGE_TITLE_CLASS, PageTitle } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { DotPattern } from "@/components/ui/dot-pattern"

type AuthShellProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  // Efecto de fondo extra (p. ej. confeti al confirmar la cuenta)
  backdrop?: React.ReactNode
}

// Estructura de las páginas de cuenta (registro, login, confirmaciones): encabezado compacto y
// una Magic Card, con la misma aparición escalonada del resto del sitio.
export function AuthShell({ eyebrow, title, description, children, backdrop }: AuthShellProps) {
  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-16 sm:px-5">
      <DotPattern className="text-foreground/15 [mask-image:radial-gradient(480px_circle_at_center,white,transparent)]" />
      {backdrop}

      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center gap-5 text-center">
        {eyebrow && (
          <BlurFade delay={0.08} inView>
            <Eyebrow>{eyebrow}</Eyebrow>
          </BlurFade>
        )}
        <PageTitle delay={0.16} className={PAGE_TITLE_CLASS}>
          {title}
        </PageTitle>
        {description && (
          <BlurFade delay={0.24} inView>
            <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-base">{description}</p>
          </BlurFade>
        )}
        <BlurFade delay={0.32} inView className="mt-3 w-full">
          <BrandCard
            className="shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_24px_64px_-24px_rgb(40_20_40/0.25)]"
            contentClassName="p-5 text-left sm:p-7"
          >
            {children}
          </BrandCard>
        </BlurFade>
      </div>
    </main>
  )
}
