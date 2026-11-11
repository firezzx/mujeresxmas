import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { MAIN_NAV, ROUTES } from "@/config/navigation"
import { SOCIAL_LINKS } from "@/config/site"

// El menú con los submenús aplanados, más Mi cuenta
const FOOTER_LINKS = [
  ...MAIN_NAV.flatMap(({ href, label, children = [] }) => [{ href, label }, ...children]),
  { href: ROUTES.miCuenta, label: "Mi cuenta" },
]

// Footer del sitio: logo, eslogan y links.
export function SiteFooter() {
  return (
    <footer className="relative isolate text-primary-foreground">
      {/* Más oscuro que las franjas negras del sitio, para que se separe sin línea */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-primary">
        <div className="absolute inset-0 bg-black/55" />
      </div>
      <div className="relative">
        <div className="mx-auto flex max-w-content flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-9">
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-fit rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
              <Logo className="h-9 fill-background" />
            </Link>
            <p className="text-sm">© Mujeres x Más · crecemos juntas</p>
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
      </div>
    </footer>
  )
}
