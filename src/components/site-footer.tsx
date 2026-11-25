import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { JOIN_HREF, ROUTES } from "@/config/navigation"
import { PILLARS, SOCIAL_LINKS } from "@/config/site"

// Solo las secciones principales: el detalle (cada pilar, el inicio) ya está en el menú de arriba
const FOOTER_LINKS = [
  { href: ROUTES.pilares, label: "Pilares" },
  { href: JOIN_HREF, label: "Quiero ser MX+" },
  { href: ROUTES.empresas, label: "Empresas" },
  { href: ROUTES.miCuenta, label: "Mi cuenta" },
]

// Footer del sitio: logo y lema arriba con los links, y abajo el cierre con el hashtag.
export function SiteFooter() {
  return (
    <footer data-site-chrome className="relative isolate text-primary-foreground">
      {/* Más oscuro que las franjas negras del sitio, para que se separe sin línea */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-primary">
        <div className="absolute inset-0 bg-black/55" />
      </div>
      <div className="relative mx-auto max-w-content px-5 sm:px-8 lg:px-9">
        <div className="flex flex-col gap-10 py-14 sm:flex-row sm:items-start sm:justify-between md:py-16">
          <div className="flex flex-col gap-4">
            <Link href="/" className="w-fit rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
              <Logo className="h-10 fill-background" />
            </Link>
            <p className="font-heading text-xs font-semibold tracking-[0.18em] text-brand-soft uppercase">
              {PILLARS.join(" · ")}
            </p>
          </div>
          <nav aria-label="Links del footer">
            <ul className="flex flex-col gap-3 text-base sm:items-end">
              {[...FOOTER_LINKS, ...SOCIAL_LINKS].map((link) => {
                const external = link.href.startsWith("http")
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      className="text-background/75 underline-offset-4 transition-colors duration-300 hover:text-background hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-2 border-t border-background/10 py-6 text-sm text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© Mujeres x Más</p>
          <p className="font-hand text-2xl leading-none font-semibold text-brand-green">#CrecemosJuntas</p>
        </div>
      </div>
    </footer>
  )
}
