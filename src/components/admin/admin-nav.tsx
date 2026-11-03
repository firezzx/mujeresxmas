"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { ADMIN_NAV } from "@/config/navigation"
import { cn } from "@/lib/utils"

// Pestañas del panel de administración. La activa lleva la pastilla rosa, que se desliza
// de una pestaña a otra.
export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Secciones del panel" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      <ul className="flex w-max gap-1 rounded-lg bg-foreground/[0.035] p-1">
        {ADMIN_NAV.map((item) => {
          const active = pathname === item.href
          return (
            <li key={item.href}>
              <IconHoverArea>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-300",
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
        })}
      </ul>
    </nav>
  )
}
