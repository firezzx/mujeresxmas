"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { LogOutIcon } from "lucide-react"

import { signOut } from "@/app/actions/auth"
import { PillArrow, PillLink } from "@/components/pill-link"
import { UserAvatar } from "@/components/site-header/user-menu"
import { MAIN_NAV, ROUTES } from "@/config/navigation"
import type { CurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.08 + i * 0.06, duration: 0.5, ease },
  }),
}

type MobileMenuProps = {
  user: CurrentUser | null
  isActive: (href: string) => boolean
  onNavigate: () => void
}

// Menú a pantalla completa para celular, debajo de la cápsula del header.
export function MobileMenu({ user, isActive, onNavigate }: MobileMenuProps) {
  return (
    <motion.div
      id="menu-movil"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease } }}
      transition={{ duration: 0.3, ease }}
      className="fixed inset-0 z-40 flex flex-col bg-background/95 px-6 pt-28 pb-[max(2rem,env(safe-area-inset-bottom))] backdrop-blur-2xl md:hidden"
    >
      <nav aria-label="Principal" className="flex-1">
        <ul className="flex flex-col">
          {MAIN_NAV.map((link, i) => (
            <motion.li
              key={link.href}
              custom={i}
              variants={item}
              initial="hidden"
              animate="show"
              className="border-b border-border/70"
            >
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive(link.href) ? "page" : undefined}
                className="group flex items-baseline gap-4 py-5"
              >
                <span className="w-6 text-xs text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-heading text-[2.25rem] leading-none font-semibold tracking-[-0.03em] transition-colors",
                    isActive(link.href) ? "text-foreground" : "text-foreground/55"
                  )}
                >
                  {link.label}
                </span>
                {isActive(link.href) && (
                  <span className="ml-auto size-2 self-center rounded-full bg-brand" aria-hidden />
                )}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      <motion.div
        custom={MAIN_NAV.length + 1}
        variants={item}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {user ? (
          <>
            <Link
              href={ROUTES.miCuenta}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm"
            >
              <UserAvatar user={user} className="size-11" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Mi cuenta"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
              </span>
              <span className="text-muted-foreground">
                <PillArrow />
              </span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <LogOutIcon className="size-4" />
                Cerrar sesión
              </button>
            </form>
          </>
        ) : (
          <>
            <PillLink href={ROUTES.registro} size="xl" onClick={onNavigate} className="w-full">
              Registrarme en Mujeres x Más
              <PillArrow />
            </PillLink>
            <PillLink href={ROUTES.login} variant="outline" size="xl" onClick={onNavigate} className="w-full">
              Iniciar sesión
            </PillLink>
          </>
        )}
        <p className="pt-3 text-center text-xs tracking-wide text-muted-foreground">
          Capacitar · Relacionar · Incluir
        </p>
      </motion.div>
    </motion.div>
  )
}
