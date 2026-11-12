"use client"

import Link from "next/link"
import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { signOut } from "@/app/actions/auth"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon } from "@/components/icons/hover-icon"
import { UserAvatar } from "@/components/site-header/user-menu"
import { JOIN_LABEL, MAIN_NAV, ROUTES, type NavLink } from "@/config/navigation"
import { PILLAR_LIST, PILLARS_MENU } from "@/content/pilares"
import type { AdminView } from "@/lib/admin"
import type { CurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

const item = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.05, duration: 0.4, ease },
  }),
}

type MobileMenuProps = {
  user: CurrentUser | null
  adminView?: AdminView | null
  isActive: (href: string) => boolean
  // true solo en esa misma página (sin contar sus subpáginas)
  pathnameIs: (href: string) => boolean
  onNavigate: () => void
}

const ROW_CLASS =
  "flex h-11 w-full items-center gap-2.5 rounded-lg px-4 font-heading text-base font-medium tracking-[-0.01em] transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"

// Punto de marca y texto que se corre cuando el link está activo
function RowLabel({ active, label }: { active: boolean; label: string }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full bg-brand-green transition-[scale,opacity] duration-300 ease-premium",
          active ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      />
      <span className={cn("transition-[translate] duration-300 ease-premium", !active && "-translate-x-4")}>
        {label}
      </span>
    </>
  )
}

function MainLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string
  label: string
  active: boolean
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        ROW_CLASS,
        active
          ? "bg-background ring-1 ring-foreground/[0.07] shadow-[0_1px_2px_rgb(26_26_26/0.06),0_6px_16px_-8px_rgb(26_26_26/0.22)] text-foreground"
          : "text-foreground/75 hover:bg-foreground/[0.04] hover:text-foreground active:bg-foreground/[0.06]"
      )}
    >
      <RowLabel active={active} label={label} />
    </Link>
  )
}

// Link con submenú: se abre y se cierra con la flechita. Arranca abierto si estás en una de sus páginas.
function MobileDropdown({
  link,
  items,
  isActive,
  pathnameIs,
  onNavigate,
}: {
  link: NavLink
  items: readonly NavLink[]
  isActive: (href: string) => boolean
  pathnameIs: (href: string) => boolean
  onNavigate: () => void
}) {
  const inSection = isActive(link.href)
  const [open, setOpen] = useState(inSection)
  const panelId = `submenu-${link.href.replace(/\W/g, "")}`
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          ROW_CLASS,
          "cursor-pointer",
          inSection && !open
            ? "bg-background ring-1 ring-foreground/[0.07] shadow-[0_1px_2px_rgb(26_26_26/0.06),0_6px_16px_-8px_rgb(26_26_26/0.22)] text-foreground"
            : "text-foreground/75 hover:bg-foreground/[0.04] hover:text-foreground active:bg-foreground/[0.06]"
        )}
      >
        <RowLabel active={inSection} label={link.label} />
        <span
          aria-hidden
          className={cn("ml-auto flex transition-transform duration-300 ease-premium", open && "rotate-180")}
        >
          <HoverIcon name="chevron-down" size={18} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <ul className="flex flex-col gap-1 pt-1.5 pb-1 pl-2">
              {items.map((child) => {
                const pillar = PILLAR_LIST.find((p) => p.href === child.href)
                const childActive = isActive(child.href)
                return (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={onNavigate}
                      aria-current={childActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-2 transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                        childActive
                          ? "bg-background ring-1 ring-foreground/[0.07] shadow-[0_1px_2px_rgb(26_26_26/0.06),0_6px_16px_-8px_rgb(26_26_26/0.22)]"
                          : "hover:bg-foreground/[0.04] active:bg-foreground/[0.06]"
                      )}
                    >
                      {pillar && (
                        <IconBadge tone={pillar.badgeTone} size="sm">
                          <HoverIcon name={pillar.icon} size={16} />
                        </IconBadge>
                      )}
                      <span className="flex min-w-0 flex-col">
                        <span className="font-heading text-[15px] font-medium">{child.label}</span>
                        {pillar && (
                          <span className="font-hand text-base leading-tight text-muted-foreground">{pillar.tag}</span>
                        )}
                      </span>
                      {childActive && (
                        <span aria-hidden className="ml-auto size-1.5 shrink-0 rounded-full bg-brand-green" />
                      )}
                    </Link>
                  </li>
                )
              })}
              <li>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  aria-current={pathnameIs(link.href) ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-lg px-2.5 text-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                    pathnameIs(link.href)
                      ? "bg-background ring-1 ring-foreground/[0.07] shadow-[0_1px_2px_rgb(26_26_26/0.06),0_6px_16px_-8px_rgb(26_26_26/0.22)]"
                      : "hover:bg-foreground/[0.04]"
                  )}
                >
                  {PILLARS_MENU.allLabel}
                  <HoverIcon name="arrow-right" size={16} />
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Contenido del menú móvil: se despliega dentro de la barra del header.
// Links compactos con la tipografía de títulos (el activo, en una pastilla rosa con el punto de marca)
// y abajo la cuenta: tarjeta con la usuaria y sus accesos, o el registro para visitantes.
export function MobileMenu({ user, adminView = null, isActive, pathnameIs, onNavigate }: MobileMenuProps) {
  return (
    <div className="px-1.5 pt-3 pb-1.5">
      <nav aria-label="Principal">
        <ul className="flex flex-col gap-1">
          {MAIN_NAV.map((link, i) => (
            <motion.li key={link.href} custom={i} variants={item} initial="hidden" animate="show">
              {link.children ? (
                <MobileDropdown
                  link={link}
                  items={link.children}
                  isActive={isActive}
                  pathnameIs={pathnameIs}
                  onNavigate={onNavigate}
                />
              ) : (
                <MainLink href={link.href} label={link.label} active={isActive(link.href)} onNavigate={onNavigate} />
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.div
        custom={MAIN_NAV.length}
        variants={item}
        initial="hidden"
        animate="show"
        className="mt-3 border-t border-border/70 pt-3"
      >
        {user ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 px-2 py-1">
              <UserAvatar user={user} className="size-9 text-xs" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Tu cuenta"}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {adminView === "admin" && (
              <Link
                href={ROUTES.admin}
                onClick={onNavigate}
                className="flex h-10 items-center justify-center rounded-lg text-sm font-medium text-foreground ring-1 ring-border transition-colors hover:ring-foreground/20"
              >
                Panel de administración
              </Link>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={ROUTES.miCuenta}
                onClick={onNavigate}
                className="flex h-10 items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Mi cuenta
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex h-10 w-full cursor-pointer items-center justify-center rounded-lg text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground hover:ring-foreground/20"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <ShimmerLink href={ROUTES.registro} size="md" arrow={false} onClick={onNavigate} className="h-11 w-full">
              {JOIN_LABEL}
            </ShimmerLink>
            <p className="pb-1 text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link
                href={ROUTES.login}
                onClick={onNavigate}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Iniciá sesión
              </Link>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
