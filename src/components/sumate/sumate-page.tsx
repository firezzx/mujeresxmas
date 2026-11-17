import { Logo } from "@/components/brand/logo"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { cardClass, HEADING_CLASS } from "@/components/landing/landing-ui"
import { HeroLights } from "@/components/landing/screen"
import { PAGE_WIDTH_CLASS } from "@/components/page-band"
import { SignupForm } from "@/components/sumate/signup-form"
import { BlurFade } from "@/components/ui/blur-fade"
import { SIGNUP_PAGE } from "@/content/sumate"
import { cn } from "@/lib/utils"

// Página de registro única (/sumate): sin menú ni footer, solo el logo, por qué sumarse y el
// formulario. Los contactos se ven en /admin/contactos.
export function SumatePage() {
  return (
    <main data-standalone-page className="relative isolate flex min-h-svh flex-1 flex-col overflow-hidden">
      <HeroLights />
      <div className={cn(PAGE_WIDTH_CLASS, "flex flex-1 flex-col py-8 md:py-10")}>
        <BlurFade>
          <Logo className="h-8 fill-foreground sm:h-9" />
        </BlurFade>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-8">
          <div className="flex flex-col items-start">
            <BlurFade delay={0.04}>
              <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.14em] text-brand-green-strong uppercase">
                <span aria-hidden className="size-1.5 rounded-full bg-brand-green" />
                {SIGNUP_PAGE.eyebrow}
              </p>
            </BlurFade>
            <BlurFade delay={0.08}>
              <h1 className={cn(HEADING_CLASS, "mt-4 text-[2.75rem] leading-[0.98] sm:text-6xl xl:text-[4.25rem]")}>
                {SIGNUP_PAGE.title} <span className="text-brand-green-strong">{SIGNUP_PAGE.titleHighlight}</span>
              </h1>
            </BlurFade>
            <BlurFade delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
                {SIGNUP_PAGE.description}
              </p>
            </BlurFade>
            <BlurFade delay={0.16} className="mt-8 w-full max-w-xl">
              <ul className="flex flex-col gap-3">
                {SIGNUP_PAGE.bullets.map((bullet) => (
                  <li key={bullet}>
                    <IconHoverArea className="flex items-center gap-3 text-[15px] leading-relaxed">
                      <IconBadge size="sm" tone="green">
                        <HoverIcon name="check" size={16} />
                      </IconBadge>
                      {bullet}
                    </IconHoverArea>
                  </li>
                ))}
              </ul>
            </BlurFade>
          </div>

          <BlurFade delay={0.2}>
            <div className={cardClass("white", "p-6 sm:p-8")}>
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-hand text-2xl leading-none font-semibold text-brand">{SIGNUP_PAGE.hand}</p>
                  <h2 className="mt-2 font-heading text-2xl font-semibold tracking-[-0.01em]">
                    {SIGNUP_PAGE.formTitle}
                  </h2>
                </div>
                <IconHoverArea>
                  <IconBadge tone="pink">
                    <HoverIcon name="user-plus" size={22} />
                  </IconBadge>
                </IconHoverArea>
              </div>
              <SignupForm />
            </div>
          </BlurFade>
        </div>

        <p className="text-center text-sm text-muted-foreground">© Mujeres x Más · crecemos juntas</p>
      </div>
    </main>
  )
}
