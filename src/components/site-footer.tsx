import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Marquee } from "@/components/ui/marquee"
import { MAIN_NAV, ROUTES } from "@/config/navigation"
import { PILLARS, SOCIAL_LINKS } from "@/config/site"

const FOOTER_LINKS = [...MAIN_NAV, { href: ROUTES.miCuenta, label: "Mi cuenta" }]

// Footer del sitio: los pilares de la comunidad en un Marquee y la línea final con logo y links.
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="overflow-hidden py-8 sm:py-10">
        {/* Pilares en movimiento, grandes y suaves de fondo */}
        <Marquee
          aria-hidden
          pauseOnHover
          repeat={3}
          className="[--duration:36s] [--gap:2.5rem] [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]"
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
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-content flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-9">
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-fit rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
              <Logo className="h-9" />
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
