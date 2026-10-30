import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { RegisterCta } from "@/components/cta/register-cta"
import { BlurFade } from "@/components/ui/blur-fade"
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Marquee } from "@/components/ui/marquee"
import { TextAnimate } from "@/components/ui/text-animate"
import { BRAND_HEX } from "@/config/brand-effects"
import { MAIN_NAV, ROUTES } from "@/config/navigation"
import { FOOTER_CTA_ID, PILLARS, SOCIAL_LINKS } from "@/config/site"

const FOOTER_LINKS = [...MAIN_NAV, { href: ROUTES.miCuenta, label: "Mi cuenta" }]

// Footer del sitio: franja de invitación (Flickering Grid + Text Animate de Magic UI), los
// pilares de la comunidad en un Marquee y la línea final con logo y links.
export function SiteFooter() {
  return (
    <footer className="relative px-4 pt-10 pb-8 sm:px-6">
      <div className="mx-auto flex max-w-[61rem] flex-col">
        <BlurFade inView>
          <section className="relative isolate overflow-hidden rounded-[32px] bg-brand-soft/50 px-6 py-14 text-center ring-1 ring-brand/15 sm:px-12 sm:py-20">
            <FlickeringGrid
              aria-hidden
              color={BRAND_HEX.brand}
              squareSize={3}
              gridGap={7}
              maxOpacity={0.28}
              flickerChance={0.08}
              className="absolute inset-0 -z-10 motion-reduce:hidden [mask-image:radial-gradient(520px_circle_at_center,white,transparent)]"
            />
            <p className="text-xs font-medium tracking-[0.18em] text-foreground/50 uppercase">{PILLARS.join(" · ")}</p>
            <TextAnimate
              as="h2"
              animation="blurInUp"
              by="word"
              once
              duration={0.5}
              className="mx-auto mt-4 max-w-xl font-heading text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-5xl"
            >
              Sumate y crecé con otras
            </TextAnimate>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-base">
              Una comunidad que capacita y conecta a mujeres y emprendedoras.
            </p>
            <div className="mt-8 flex justify-center">
              <RegisterCta id={FOOTER_CTA_ID} className="w-full sm:w-auto" />
            </div>
          </section>
        </BlurFade>

        {/* Pilares en movimiento, grandes y suaves de fondo */}
        <Marquee
          aria-hidden
          pauseOnHover
          repeat={3}
          className="mt-10 [--duration:36s] [--gap:2.5rem] [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]"
        >
          {PILLARS.map((pillar) => (
            <span
              key={pillar}
              className="flex items-center gap-10 font-heading text-6xl leading-none font-semibold tracking-[-0.04em] text-foreground/[0.06] select-none sm:text-8xl"
            >
              {pillar}
              <span className="size-3 rounded-full bg-brand/30 sm:size-4" />
            </span>
          ))}
        </Marquee>

        <div className="mt-10 flex flex-col gap-6 border-t border-border/70 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-fit rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
              <Logo />
            </Link>
            <p className="text-[13px] text-muted-foreground">© Mujeres x Más</p>
          </div>
          <nav aria-label="Links del footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[...FOOTER_LINKS, ...SOCIAL_LINKS].map((link) => {
                const external = link.href.startsWith("http")
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      className="text-muted-foreground underline-offset-4 transition-colors duration-300 hover:text-foreground hover:underline hover:decoration-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
