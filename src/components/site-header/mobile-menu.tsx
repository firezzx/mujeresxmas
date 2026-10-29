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

// Contenido del menú móvil: se despliega dentro de la cápsula del header, con las mismas
// pastillas suaves de la navegación de escritorio.
export function MobileMenu({ user, isActive, onNavigate }: MobileMenuProps) {
  return (
    <div className="px-1.5 pt-3 pb-1.5">
      <div className="mx-2 h-px bg-border/70" />

      <nav aria-label="Principal" className="pt-2">
        <ul className="flex flex-col gap-0.5">
          {MAIN_NAV.map((link, i) => {
            const active = isActive(link.href)
            return (
              <motion.li key={link.href} custom={i} variants={item} initial="hidden" animate="show">
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-12 items-center gap-3 rounded-2xl px-4 text-[15px] font-medium transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                    active
                      ? "bg-foreground/[0.06] text-foreground"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                  )}
                >
                  {link.label}
                  {active ? (
                    <span aria-hidden className="ml-auto size-1.5 rounded-full bg-brand" />
                  ) : (
                    <ArrowRight aria-hidden className="ml-auto size-4 opacity-40" />
                  )}
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
        className="flex flex-col gap-1 pt-3"
      >
        {user ? (
          <>
            <Link
              href={ROUTES.miCuenta}
              onClick={onNavigate}
              className="flex h-12 items-center rounded-2xl px-4 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            >
              Mi cuenta
              <ArrowRight aria-hidden className="ml-auto size-4 opacity-40" />
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex h-12 w-full items-center gap-2 rounded-2xl px-4 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
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
