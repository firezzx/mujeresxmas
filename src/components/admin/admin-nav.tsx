"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { setShowPendingSections } from "@/app/actions/admin"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { ADMIN_NAV, ROUTES } from "@/config/navigation"
import { cn } from "@/lib/utils"

type AdminNavItem = (typeof ADMIN_NAV)[number]

// Pestañas del panel de administración. La activa lleva la pastilla rosa, que se desliza
// de una pestaña a otra. Las secciones en preparación van aparte, a la derecha y con borde
// punteado, y se ven solo con showPending (o si estás en una).
export function AdminNav({ showPending }: { showPending: boolean }) {
  const pathname = usePathname()
  const isActive = (href: string) =>
    // "Usuarios" es la raíz del panel: las demás quedan activas también en sus subpáginas
    href === ROUTES.admin ? pathname === href : pathname.startsWith(href)

  const main = ADMIN_NAV.filter((item) => !("pending" in item))
  const pending = ADMIN_NAV.filter((item) => "pending" in item && (showPending || isActive(item.href)))

  return (
    <nav
      aria-label="Secciones del panel"
      className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
    >
      <ul className="flex w-max shrink-0 gap-1 rounded-lg bg-foreground/[0.035] p-1">
        {main.map((item) => (
          <NavTab key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </ul>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {pending.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-heading text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap text-foreground/45 uppercase">
              En preparación
            </span>
            <ul className="flex w-max gap-1 rounded-lg border border-dashed border-foreground/20 p-1">
              {pending.map((item) => (
                <NavTab key={item.href} item={item} active={isActive(item.href)} />
              ))}
            </ul>
          </div>
        )}
        <IconHoverArea className="shrink-0">
          <form action={setShowPendingSections.bind(null, !showPending)}>
            <button
              type="submit"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 text-xs font-medium whitespace-nowrap text-foreground/55 transition-colors duration-300 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <HoverIcon name={showPending ? "eye-off" : "eye"} size={14} />
              {showPending ? "Ocultar en preparación" : "Mostrar en preparación"}
            </button>
          </form>
        </IconHoverArea>
      </div>
    </nav>
  )
}

function NavTab({ item, active }: { item: AdminNavItem; active: boolean }) {
  return (
    <li>
      <IconHoverArea>
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={cn(
            "relative flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300",
            active ? "text-foreground" : "text-foreground/55 hover:text-foreground"
          )}
        >
          {active && (
            <motion.span
              layoutId="admin-nav-pill"
              aria-hidden
              className="absolute inset-0 rounded-lg bg-brand-soft shadow-[0_1px_2px_0_rgb(26_26_26/0.06)]"
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            <HoverIcon name={item.icon} size={16} />
            {item.label}
          </span>
        </Link>
      </IconHoverArea>
    </li>
  )
}
