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
import { IconLink } from "@/components/buttons/icon-link"
import { UserIcon } from "@/components/icons/user"
import { UserPlusIcon } from "@/components/icons/user-plus"
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
            "grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-full border transition-all duration-500 ease-premium",
            // Cápsula de vidrio (celular siempre; escritorio al scrollear)
            "max-w-4xl border-border/70 bg-background/85 px-1.5 py-1.5 shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_8px_32px_-12px_rgb(40_20_40/0.18)] backdrop-blur-xl backdrop-saturate-150",
            !scrolled &&
              !menuOpen &&
              "md:max-w-6xl md:border-transparent md:bg-transparent md:px-0 md:py-3 md:shadow-none md:backdrop-blur-none"
          )}
        >
          {/* Izquierda: menú (escritorio) o botón de menú (celular) */}
          <div className="flex items-center">
            <MenuToggle
              open={menuOpen}
              onToggle={() => setMenuOpen((o) => !o)}
              className="md:hidden"
            />
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
          </div>

          {/* Centro: logo */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Mujeres x Más, ir al inicio"
            className="justify-self-center rounded-full px-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Logo />
          </Link>

          {/* Derecha: accesos de usuaria */}
          <div className="flex items-center justify-end gap-1.5">
            {pending ? (
              <span aria-hidden className="size-10 animate-pulse rounded-full bg-muted" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <IconLink href={ROUTES.login} icon={UserIcon} label="Iniciar sesión" onClick={closeMenu} />
                <IconLink href={ROUTES.registro} icon={UserPlusIcon} label="Registrarme" variant="solid" onClick={closeMenu} />
              </>
            )}
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

function MenuToggle({
  open,
  onToggle,
  className,
}: {
  open: boolean
  onToggle: () => void
  className?: string
}) {
  const line = "absolute left-1/2 h-[1.5px] w-[18px] -translate-x-1/2 rounded-full bg-foreground"
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="menu-movil"
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
      className={cn(
        "relative size-10 rounded-full transition-colors hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/40 outline-none",
        className
      )}
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
