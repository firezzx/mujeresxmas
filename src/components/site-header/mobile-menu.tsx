"use client"

import Link from "next/link"
import { motion } from "motion/react"

import { signOut } from "@/app/actions/auth"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { UserAvatar } from "@/components/site-header/user-menu"
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

// Contenido del menú móvil: se despliega dentro de la cápsula del header.
// Links con la tipografía de títulos (el activo, en una pastilla rosa con el punto de marca)
// y abajo la cuenta: tarjeta con la usuaria y sus accesos, o el registro para visitantes.
export function MobileMenu({ user, isActive, onNavigate }: MobileMenuProps) {
  return (
    <div className="px-1.5 pt-3 pb-1.5">
      <nav aria-label="Principal">
        <ul className="flex flex-col gap-1">
          {MAIN_NAV.map((link, i) => {
            const active = isActive(link.href)
            return (
              <motion.li key={link.href} custom={i} variants={item} initial="hidden" animate="show">
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-14 items-center gap-3 rounded-[20px] px-4 font-heading text-[22px] font-semibold tracking-[-0.02em] transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                    active
                      ? "bg-brand-soft text-foreground"
                      : "text-foreground/50 hover:bg-foreground/[0.04] hover:text-foreground active:bg-foreground/[0.06]"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full bg-brand transition-[scale,opacity] duration-300 ease-premium",
                      active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}
                  />
                  <span className={cn("transition-[translate] duration-300 ease-premium", !active && "-translate-x-[18px]")}>
                    {link.label}
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
        className="mt-3 border-t border-border/70 pt-3"
      >
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <UserAvatar user={user} className="size-11 text-sm" />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium">
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Tu cuenta"}
                </p>
                <p className="truncate text-[13px] text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={ROUTES.miCuenta}
                onClick={onNavigate}
                className="flex h-11 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Mi cuenta
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex h-11 w-full cursor-pointer items-center justify-center rounded-full text-sm font-medium text-muted-foreground ring-1 ring-border transition-colors hover:text-foreground hover:ring-foreground/20"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <ShimmerLink href={ROUTES.registro} size="md" arrow={false} onClick={onNavigate} className="h-12 w-full">
              Registrarme en Mujeres x Más
            </ShimmerLink>
            <p className="pb-1 text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link href={ROUTES.login} onClick={onNavigate} className="font-medium text-foreground underline-offset-4 hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
