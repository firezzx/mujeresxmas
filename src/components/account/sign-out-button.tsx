"use client"

import { signOut } from "@/app/actions/auth"
import { LogoutIcon, type LogoutIconHandle } from "@/components/icons/logout"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import { cn } from "@/lib/utils"

// Cierra la sesión con el ícono animado de Lucide Animated.
export function SignOutButton({ className }: { className?: string }) {
  const { iconRef, triggerProps } = useIconAnimation<LogoutIconHandle>()

  return (
    <form action={signOut} className={className}>
      <button
        type="submit"
        {...triggerProps}
        className={cn(
          "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-5 text-sm font-medium text-muted-foreground",
          "transition-colors duration-300 outline-none hover:border-foreground/20 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
        )}
      >
        <LogoutIcon ref={iconRef} size={17} className="pointer-events-none" />
        Cerrar sesión
      </button>
    </form>
  )
}
