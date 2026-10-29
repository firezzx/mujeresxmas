"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react"

import { Logo } from "@/components/brand/logo"
import { PillArrow, PillLink } from "@/components/pill-link"
import { MobileMenu } from "@/components/site-header/mobile-menu"
import { UserMenu } from "@/components/site-header/user-menu"
import { MAIN_NAV, ROUTES } from "@/config/navigation"
import type { CurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  user: CurrentUser | null
  // true mientras se resuelve la sesión: muestra un lugar reservado en vez de botones
  pending?: boolean
}

// Header flotante. En escritorio arranca abierto y transparente, y al scrollear se convierte
// en una cápsula de vidrio centrada. En celular es siempre una cápsula, con menú a pantalla completa.
export function SiteHeader({ user, pending = false }: SiteHeaderProps) {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24))

  // Bloquea el scroll de la página y habilita Escape mientras el menú móvil está abierto
  useEffect(() => {
    if (!menuOpen) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      root.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  const activeHref = MAIN_NAV.find((item) => isActive(item.href))?.href
  const highlighted = hovered ?? activeHref
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 md:pt-4">
        <div
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-full border transition-all duration-500 ease-premium",
            // Cápsula de vidrio (celular siempre; escritorio al scrollear)
            "max-w-4xl border-border/70 bg-background/85 py-1.5 pr-1.5 pl-5 shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_8px_32px_-12px_rgb(40_20_40/0.18)] backdrop-blur-xl backdrop-saturate-150",
            !scrolled &&
              !menuOpen &&
              "md:max-w-6xl md:border-transparent md:bg-transparent md:py-3 md:pl-3 md:shadow-none md:backdrop-blur-none"
          )}
        >
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Mujeres x Más, ir al inicio"
            className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Logo />
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul
              className="flex items-center gap-1"
              onMouseLeave={() => setHovered(null)}
            >
              {MAIN_NAV.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => setHovered(item.href)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 outline-none",
                      highlighted === item.href
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                  {highlighted === item.href && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 rounded-full bg-foreground/[0.06]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            {/* Escritorio */}
            <div className="hidden items-center gap-1.5 md:flex">
              {pending ? (
                <span aria-hidden className="h-10 w-48 animate-pulse rounded-full bg-muted" />
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                <>
                  <PillLink href={ROUTES.login} variant="ghost" size="md">
                    Iniciar sesión
                  </PillLink>
                  <PillLink href={ROUTES.registro} size="md">
                    Registrarme
                    <PillArrow />
                  </PillLink>
                </>
              )}
            </div>

            {/* Celular */}
            <div className="flex items-center gap-1 md:hidden">
              {pending ? (
                <span aria-hidden className="size-9 animate-pulse rounded-full bg-muted" />
              ) : user ? (
                <UserMenu user={user} />
              ) : (
                !menuOpen && (
                  <PillLink href={ROUTES.registro} size="sm">
                    Registrarme
                  </PillLink>
                )
              )}
              <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} />
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            user={user}
            isActive={isActive}
            onNavigate={closeMenu}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const line = "absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 rounded-full bg-foreground"
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="menu-movil"
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
      className="relative size-10 rounded-full transition-colors hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/40 outline-none"
    >
      <motion.span
        className={line}
        initial={false}
        animate={open ? { top: "50%", rotate: 45, y: "-50%" } : { top: "38%", rotate: 0, y: "-50%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className={line}
        initial={false}
        animate={open ? { top: "50%", rotate: -45, y: "-50%" } : { top: "62%", rotate: 0, y: "-50%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
    </button>
  )
}
