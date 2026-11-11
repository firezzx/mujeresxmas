"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { Logo, LogoShort } from "@/components/brand/logo"
import { IconLink } from "@/components/buttons/icon-link"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { UserIcon } from "@/components/icons/user"
import { MobileMenu } from "@/components/site-header/mobile-menu"
import { UserMenu } from "@/components/site-header/user-menu"
import { JOIN_LABEL, MAIN_NAV, ROUTES, type NavLink } from "@/config/navigation"
import { PILLAR_LIST, PILLARS_MENU, PILLARS_PAGE } from "@/content/pilares"
import type { AdminView } from "@/lib/admin"
import type { CurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

type SiteHeaderProps = {
  user: CurrentUser | null
  // Solo para administradoras: muestra los accesos al panel según la vista elegida
  adminView?: AdminView | null
  // true mientras el servidor confirma la sesión: los accesos salen del aviso de <html data-session>
  pending?: boolean
  // Notificaciones sin leer de la usuaria (punto en el avatar)
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
  // Super menú abierto (link con submenú en escritorio). Se cierra solo al cambiar de página.
  const [megaOpen, setMegaOpen] = useState(false)
  const [megaPath, setMegaPath] = useState(pathname)
  if (megaPath !== pathname) {
    setMegaPath(pathname)
    setMegaOpen(false)
  }
  const closeTimer = useRef<number | null>(null)
  const openMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  // Con una pequeña espera, para que el mouse pueda bajar del link al panel
  const scheduleCloseMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 180)
  }

  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [megaOpen])

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

  const isActive = (href: string) => (href === "/" ? pathname === "/" : Boolean(pathname?.startsWith(href)))
  const activeHref = MAIN_NAV.find((item) => isActive(item.href))?.href
  const megaHref = MAIN_NAV.find((item) => item.children)?.href
  const highlighted = hovered ?? (megaOpen ? megaHref : activeHref)
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
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="pointer-events-none fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[2px] max-lg:hidden"
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
        <div className="mx-auto max-w-content-inner px-2 py-2 sm:px-3 lg:py-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* Izquierda: perfil (celular) o links (escritorio) */}
            <div className="flex items-center">
              <div className="lg:hidden">
                <UserAccess
                  user={user}
                  adminView={adminView}
                  unread={unread}
                  pending={pending}
                  onNavigate={closeMenu}
                  compact
                />
              </div>
              <nav aria-label="Principal" className="hidden lg:block">
                <ul className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
                  {MAIN_NAV.map((item) => {
                    const hasMenu = Boolean(item.children)
                    return (
                      <li
                        key={item.href}
                        onMouseEnter={hasMenu ? openMega : undefined}
                        onMouseLeave={hasMenu ? scheduleCloseMega : undefined}
                        onFocus={hasMenu ? openMega : undefined}
                        onBlur={
                          hasMenu
                            ? (e) => {
                                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMegaOpen(false)
                              }
                            : undefined
                        }
                      >
                        <IconHoverArea className="relative">
                          <Link
                            href={item.href}
                            onMouseEnter={() => setHovered(item.href)}
                            onFocus={() => setHovered(item.href)}
                            onBlur={() => setHovered(null)}
                            aria-current={isActive(item.href) ? "page" : undefined}
                            aria-haspopup={hasMenu ? "true" : undefined}
                            aria-expanded={hasMenu ? megaOpen : undefined}
                            className={cn(
                              "relative z-10 flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-300 outline-none",
                              hasMenu && "pr-3",
                              highlighted === item.href ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {item.label}
                            {hasMenu && (
                              <span
                                aria-hidden
                                className={cn(
                                  "flex transition-transform duration-300 ease-premium",
                                  megaOpen && "rotate-180"
                                )}
                              >
                                <HoverIcon name="chevron-down" size={15} />
                              </span>
                            )}
                          </Link>
                          {highlighted === item.href && (
                            <motion.span
                              layoutId="nav-highlight"
                              className="absolute inset-0 rounded-lg bg-brand-soft"
                              transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                          )}
                        </IconHoverArea>
                        {item.children && (
                          <AnimatePresence>
                            {megaOpen && (
                              <MegaMenu
                                parent={item}
                                items={item.children}
                                isActive={isActive}
                                onNavigate={() => setMegaOpen(false)}
                              />
                            )}
                          </AnimatePresence>
                        )}
                      </li>
                    )
                  })}
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
              <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} className="lg:hidden" />
              <div className="hidden items-center gap-1.5 lg:flex">
                <UserAccess
                  user={user}
                  adminView={adminView}
                  unread={unread}
                  pending={pending}
                  onNavigate={closeMenu}
                />
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
                <MobileMenu
                  user={user}
                  adminView={adminView}
                  isActive={isActive}
                  pathnameIs={(href) => pathname === href}
                  onNavigate={closeMenu}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  )
}

// Super menú de escritorio: un panel a todo el ancho debajo del header, con una presentación a la
// izquierda y cada pilar con su foto, su ícono, su rótulo manuscrito y el resumen.
function MegaMenu({
  parent,
  items,
  isActive,
  onNavigate,
}: {
  parent: NavLink
  items: readonly NavLink[]
  isActive: (href: string) => boolean
  onNavigate: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease }}
      className="absolute inset-x-0 top-full border-b border-border bg-background shadow-[0_32px_64px_-32px_rgb(26_26_26/0.35)] max-lg:hidden"
    >
      <div className="mx-auto grid max-w-content-inner grid-cols-[minmax(0,0.85fr)_minmax(0,3fr)] gap-10 px-5 py-8">
        <div className="flex flex-col gap-3 border-r border-border pr-8">
          <span className="font-heading text-xs font-semibold tracking-[0.18em] text-brand-green-strong uppercase">
            {PILLARS_MENU.eyebrow}
          </span>
          <p className="font-heading text-2xl leading-tight font-semibold tracking-[-0.01em] text-balance">
            {PILLARS_PAGE.titleStart} <span className="text-brand">{PILLARS_PAGE.titleHighlight}</span>
          </p>
          <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{PILLARS_MENU.description}</p>
          <IconHoverArea className="mt-auto">
            <Link
              href={parent.href}
              onClick={onNavigate}
              className="inline-flex items-center gap-2 rounded-lg py-1 text-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              {PILLARS_MENU.allLabel}
              <HoverIcon name="arrow-right" size={16} />
            </Link>
          </IconHoverArea>
        </div>

        <ul className="grid grid-cols-3 gap-5">
          {items.map((child, index) => {
            const pillar = PILLAR_LIST.find((p) => p.href === child.href)
            const active = isActive(child.href)
            return (
              <motion.li
                key={child.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease, delay: 0.04 + index * 0.05 }}
              >
                <IconHoverArea className="h-full">
                  <Link
                    href={child.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/card flex h-full flex-col gap-3 rounded-xl p-2.5 transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                      active ? "bg-brand-soft/60" : "hover:bg-foreground/[0.035]"
                    )}
                  >
                    {pillar && (
                      <span className="relative block aspect-[16/10] overflow-hidden rounded-lg">
                        <Image
                          src={pillar.image}
                          alt=""
                          fill
                          sizes="22vw"
                          className="object-cover transition-transform duration-700 ease-premium group-hover/card:scale-105"
                        />
                        <span className="absolute bottom-2 left-2 rounded-md bg-background px-2.5 py-1 font-hand text-lg leading-none font-semibold">
                          {pillar.tag}
                        </span>
                      </span>
                    )}
                    <span className="flex items-center gap-2.5 px-1">
                      {pillar && (
                        <IconBadge tone={pillar.badgeTone} size="sm">
                          <HoverIcon name={pillar.icon} size={16} />
                        </IconBadge>
                      )}
                      <span className="font-heading text-base font-semibold">{child.label}</span>
                      {active && <span aria-hidden className="ml-auto size-1.5 rounded-full bg-brand" />}
                    </span>
                    {pillar && (
                      <span className="line-clamp-2 px-1 pb-1 text-sm leading-relaxed text-muted-foreground">
                        {pillar.summary}
                      </span>
                    )}
                  </Link>
                </IconHoverArea>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </motion.div>
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
  const guestAccess = (
    <>
      <IconLink href={ROUTES.login} icon={UserIcon} label="Iniciar sesión" onClick={onNavigate} />
      {!compact && (
        <ShimmerLink href={ROUTES.registro} size="md" arrow={false} onClick={onNavigate} className="min-h-10">
          {JOIN_LABEL}
        </ShimmerLink>
      )}
    </>
  )
  if (pending) {
    // Mismo tamaño que el avatar, para que no se mueva nada cuando llega la usuaria
    return (
      <>
        <span aria-hidden className="only-member block size-10 rounded-lg bg-muted ring-1 ring-border" />
        <div className="only-guest contents">{guestAccess}</div>
      </>
    )
  }
  if (user) return <UserMenu user={user} adminView={adminView} unread={unread} align={compact ? "start" : "end"} />
  return guestAccess
}

function MenuToggle({ open, onToggle, className }: { open: boolean; onToggle: () => void; className?: string }) {
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
