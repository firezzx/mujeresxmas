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

import { Logo, LogoShort } from "@/components/brand/logo"
import { IconLink } from "@/components/buttons/icon-link"
import { UserIcon } from "@/components/icons/user"
import { UserPlusIcon } from "@/components/icons/user-plus"
import { MobileMenu } from "@/components/site-header/mobile-menu"
import { UserMenu } from "@/components/site-header/user-menu"
import { MAIN_NAV, ROUTES } from "@/config/navigation"
import type { AdminView } from "@/lib/admin"
import type { CurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

type SiteHeaderProps = {
  user: CurrentUser | null
  // Solo para administradoras: muestra los accesos al panel según la vista elegida
  adminView?: AdminView | null
  // true mientras se resuelve la sesión: muestra un lugar reservado en vez de botones
  pending?: boolean
  // Notificaciones sin leer de la usuaria (punto en el avatar)
  unread?: number
}

// Header flotante.
// Escritorio: links a la izquierda, logo al centro e íconos de usuaria a la derecha. Arranca
// transparente y al scrollear se convierte en una cápsula de vidrio.
// Celular: perfil a la izquierda, logo corto al centro y menú a la derecha. El menú se abre
// dentro de la misma cápsula, que se estira hacia abajo.
export function SiteHeader({ user, adminView = null, pending = false, unread = 0 }: SiteHeaderProps) {
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
      {/* Velo detrás del menú móvil: oscurece apenas la página y cierra al tocar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            aria-hidden
            onClick={closeMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[3px] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mismo margen lateral que el contenido de las páginas (px-4 sm:px-6) */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:px-6 md:pt-4">
        <div
          className={cn(
            // overflow-hidden solo en celular (recorta el menú al desplegarse); en escritorio dejaría sin tooltips
            "w-full rounded-[26px] border transition-all duration-500 ease-premium max-md:overflow-hidden md:rounded-full",
            // Cápsula de vidrio (celular siempre; escritorio al scrollear). Al scrollear mide lo
            // mismo que el contenido más ancho del sitio (max-w-content con px-6, como Mi cuenta)
            "max-w-content-inner border-border/70 bg-background/85 px-1.5 py-1.5 shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_8px_32px_-12px_rgb(26_26_26/0.18)] backdrop-blur-xl backdrop-saturate-150",
            menuOpen && "bg-background/95 shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_24px_48px_-16px_rgb(26_26_26/0.28)]",
            !scrolled &&
              !menuOpen &&
              "md:max-w-content md:border-transparent md:bg-transparent md:px-0 md:py-3 md:shadow-none md:backdrop-blur-none"
          )}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* Izquierda: perfil (celular) o links (escritorio) */}
            <div className="flex items-center">
              <div className="md:hidden">
                <UserAccess user={user} adminView={adminView} unread={unread} pending={pending} onNavigate={closeMenu} compact />
              </div>
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
                          className="absolute inset-0 rounded-full bg-brand-soft"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Centro: logo (corto en celular) */}
            <Link
              href="/"
              onClick={closeMenu}
              aria-label="Mujeres x Más, ir al inicio"
              className="flex h-10 items-center justify-self-center rounded-full px-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <LogoShort className="md:hidden" />
              <Logo entrance={pending ? "waiting" : "play"} className="h-9 max-md:hidden" />
            </Link>

            {/* Derecha: menú (celular) o accesos de usuaria (escritorio) */}
            <div className="flex items-center justify-end gap-1.5">
              <MenuToggle
                open={menuOpen}
                onToggle={() => setMenuOpen((o) => !o)}
                className="md:hidden"
              />
              <div className="hidden items-center gap-1.5 md:flex">
                <UserAccess user={user} adminView={adminView} unread={unread} pending={pending} onNavigate={closeMenu} />
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {menuOpen && (
              <motion.div
                id="menu-movil"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                className="md:hidden"
              >
                <MobileMenu user={user} adminView={adminView} isActive={isActive} onNavigate={closeMenu} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
}

// Accesos de usuaria: avatar con sesión; sin sesión, Iniciar sesión (y Registrarme en escritorio).
function UserAccess({
  user,
  adminView,
  unread,
  pending,
  onNavigate,
  compact = false,
}: {
  user: CurrentUser | null
  adminView: AdminView | null
  unread: number
  pending: boolean
  onNavigate: () => void
  compact?: boolean
}) {
  if (pending) {
    return <span aria-hidden className="block size-10 animate-pulse rounded-full bg-muted" />
  }
  if (user) return <UserMenu user={user} adminView={adminView} unread={unread} align={compact ? "start" : "end"} />
  return (
    <>
      <IconLink href={ROUTES.login} icon={UserIcon} label="Iniciar sesión" onClick={onNavigate} />
      {!compact && (
        <IconLink href={ROUTES.registro} icon={UserPlusIcon} label="Registrarme" variant="solid" onClick={onNavigate} />
      )}
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
        transition={{ duration: 0.35, ease }}
      />
      <motion.span
        className={line}
        initial={false}
        animate={open ? { top: "50%", rotate: -45, y: "-50%" } : { top: "62%", rotate: 0, y: "-50%" }}
        transition={{ duration: 0.35, ease }}
      />
    </button>
  )
}
