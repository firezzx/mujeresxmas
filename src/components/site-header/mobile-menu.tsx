"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, LogOutIcon } from "lucide-react"

import { signOut } from "@/app/actions/auth"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { MAIN_NAV, ROUTES } from "@/config/navigation"
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
  isActive: (href: string) => boolean
  onNavigate: () => void
}

// Contenido del menú móvil: se despliega dentro de la cápsula del header. Los links son
// grandes, con la tipografía de títulos y número de sección; el activo lleva el punto de marca.
export function MobileMenu({ user, isActive, onNavigate }: MobileMenuProps) {
  return (
    <div className="px-1.5 pt-3 pb-1.5">
      <div className="mx-2 h-px bg-border/70" />

      <nav aria-label="Principal" className="px-2 pt-1">
        <ul className="flex flex-col">
          {MAIN_NAV.map((link, i) => {
            const active = isActive(link.href)
            return (
              <motion.li
                key={link.href}
                custom={i}
                variants={item}
                initial="hidden"
                animate="show"
                className="border-b border-border/60"
              >
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className="group flex items-center gap-4 rounded-xl py-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <span
                    className={cn(
                      "w-5 text-[11px] font-medium tabular-nums transition-colors duration-300",
                      active ? "text-brand" : "text-muted-foreground/70"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-heading text-[28px] leading-none font-semibold tracking-[-0.03em] transition-[color,translate] duration-500 ease-premium group-active:translate-x-1",
                      active ? "text-foreground" : "text-foreground/45 group-hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {active && <span className="text-brand">.</span>}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "ml-auto flex size-9 items-center justify-center rounded-full transition-[background-color,color,box-shadow,rotate] duration-500 ease-premium group-hover:-rotate-45 group-active:-rotate-45",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground ring-1 ring-border group-hover:bg-brand group-hover:text-brand-foreground group-hover:ring-transparent group-active:bg-brand group-active:text-brand-foreground"
                    )}
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </motion.li>
            )
          })}
        </ul>
      </nav>

      <motion.div
        custom={MAIN_NAV.length}
        variants={item}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-1 pt-4"
      >
        {user ? (
          <>
            <Link
              href={ROUTES.miCuenta}
              onClick={onNavigate}
              className="flex h-12 items-center rounded-2xl px-2 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            >
              Mi cuenta
              <ArrowRight aria-hidden className="ml-auto size-4 opacity-40" />
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex h-12 w-full items-center gap-2 rounded-2xl px-2 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
              >
                Cerrar sesión
                <LogOutIcon aria-hidden className="ml-auto size-4 opacity-60" />
              </button>
            </form>
          </>
        ) : (
          <ShimmerLink href={ROUTES.registro} size="md" onClick={onNavigate} className="h-12 w-full">
            Registrarme en Mujeres x Más
          </ShimmerLink>
        )}
      </motion.div>
    </div>
  )
}
