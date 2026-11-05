"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { Logo, LogoShort } from "@/components/brand/logo"
import { IconLink } from "@/components/buttons/icon-link"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { UserIcon } from "@/components/icons/user"
import { MobileMenu } from "@/components/site-header/mobile-menu"
import { NotificationsBell } from "@/components/notifications/notifications-bell"
import { UserMenu } from "@/components/site-header/user-menu"
import { JOIN_LABEL, MAIN_NAV, ROUTES } from "@/config/navigation"
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
  // Notificaciones sin leer de la usuaria (contador de la campana)
  unread?: number
}

// Header con el link activo según la URL. En una ruta con parámetros (/admin/blog/[id]) la URL
// se conoce recién en el pedido: necesita un <Suspense> arriba, con SiteHeaderView de fallback.
export function SiteHeader(props: SiteHeaderProps) {
  const pathname = usePathname()
  return <SiteHeaderView {...props} pathname={pathname} />
}

// Header fijo: una barra de vidrio de borde a borde.
// Escritorio: links a la izquierda, logo al centro y accesos de usuaria a la derecha.
// Celular: perfil a la izquierda, logo corto al centro y menú a la derecha. El menú se abre
// dentro de la misma barra, que se estira hacia abajo.
export function SiteHeaderView({
  user,
  adminView = null,
  pending = false,
  unread = 0,
  pathname,
}: SiteHeaderProps & { pathname: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

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
    href === "/" ? pathname === "/" : Boolean(pathname?.startsWith(href))
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
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[3px] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mismos márgenes y ancho que el contenido de la página */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 px-3 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 sm:px-6",
          menuOpen && "bg-background/95"
        )}
      >
        <div className="relative mx-auto max-w-content-inner px-2 py-2 sm:px-3 lg:py-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* Izquierda: perfil (celular) o links (escritorio) */}
            <div className="flex items-center">
              <div className="lg:hidden">
                <UserAccess user={user} adminView={adminView} unread={unread} pending={pending} onNavigate={closeMenu} compact />
              </div>
              <nav aria-label="Principal" className="hidden lg:block">
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
                          "relative z-10 block rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 outline-none",
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
                          className="absolute inset-0 rounded-lg bg-brand-soft"
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
              className="flex h-10 items-center justify-self-center rounded-lg px-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <LogoShort className="lg:hidden" />
              <Logo entrance={pending ? "waiting" : "play"} className="h-9 max-lg:hidden" />
            </Link>

            {/* Derecha: menú (celular) o accesos de usuaria (escritorio) */}
            <div className="flex items-center justify-end gap-1.5">
              <MenuToggle
                open={menuOpen}
                onToggle={() => setMenuOpen((o) => !o)}
                className="lg:hidden"
              />
              <div className="hidden items-center gap-1.5 lg:flex">
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
                className="overflow-hidden lg:hidden"
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

// Accesos de usuaria: avatar con sesión; sin sesión, Iniciar sesión (y el destacado Unirse a MX+ en escritorio).
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
    return <span aria-hidden className="block size-10 animate-pulse rounded-lg bg-muted" />
  }
  if (user) {
    return (
      <div className="flex items-center gap-2.5">
        <NotificationsBell unread={unread} />
        <UserMenu user={user} adminView={adminView} unread={unread} align={compact ? "start" : "end"} />
      </div>
    )
  }
  return (
    <>
      <IconLink href={ROUTES.login} icon={UserIcon} label="Iniciar sesión" onClick={onNavigate} />
      {!compact && (
        <ShimmerLink href={ROUTES.registro} size="md" arrow={false} onClick={onNavigate} className="min-h-10">
          {JOIN_LABEL}
        </ShimmerLink>
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
        "relative size-10 rounded-lg transition-colors hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/40 outline-none",
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
