"use client"

import Link from "next/link"

import { setMemberView } from "@/app/actions/admin"
import { signOut } from "@/app/actions/auth"
import { BellIcon } from "@/components/icons/bell"
import { EyeIcon } from "@/components/icons/eye"
import { LayoutPanelTopIcon } from "@/components/icons/layout-panel-top"
import { LogoutIcon } from "@/components/icons/logout"
import { UserIcon } from "@/components/icons/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROUTES } from "@/config/navigation"
import type { AdminView } from "@/lib/admin"
import type { CurrentUser } from "@/lib/supabase/user"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import { cn } from "@/lib/utils"

function initials(user: CurrentUser) {
  const fromName = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((part) => part!.charAt(0))
    .join("")
  return (fromName || user.email?.charAt(0) || "?").toUpperCase()
}

export function UserAvatar({ user, className }: { user: CurrentUser; className?: string }) {
  return (
    <Avatar className={cn("size-9", className)}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
      <AvatarFallback className="bg-brand-soft font-medium text-foreground">{initials(user)}</AvatarFallback>
    </Avatar>
  )
}

export function UserMenu({
  user,
  adminView = null,
  unread = 0,
  align = "end",
}: {
  user: CurrentUser
  adminView?: AdminView | null
  unread?: number
  align?: "start" | "end"
}) {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Mi cuenta"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={
          unread
            ? `Abrir menú de mi cuenta (${unread} ${unread === 1 ? "notificación sin leer" : "notificaciones sin leer"})`
            : "Abrir menú de mi cuenta"
        }
        className="relative rounded-lg p-0.5 ring-1 ring-border transition-shadow outline-none hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <UserAvatar user={user} />
        {unread > 0 && (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-brand ring-2 ring-background"
          >
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-50" />
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={10}
        className="w-64 rounded-lg p-1.5 shadow-[0_16px_48px_-16px_rgb(26_26_26/0.3)]"
      >
        <div className="flex items-center gap-3 px-2.5 py-2.5">
          <UserAvatar user={user} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <IconMenuItem icon={UserIcon} render={<Link href={ROUTES.miCuenta} />}>
          Mi cuenta
        </IconMenuItem>
        <IconMenuItem icon={BellIcon} render={<Link href={`${ROUTES.miCuenta}#notificaciones`} />}>
          Notificaciones
          {unread > 0 && (
            <span className="ml-auto rounded-md bg-brand px-2 py-0.5 text-[11px] leading-none font-semibold text-brand-foreground">
              {unread}
            </span>
          )}
        </IconMenuItem>
        {adminView === "admin" && (
          <>
            <IconMenuItem icon={LayoutPanelTopIcon} render={<Link href={ROUTES.admin} />}>
              Panel de administración
            </IconMenuItem>
            <IconMenuItem icon={EyeIcon} onClick={() => setMemberView(true)}>
              Ver como usuario
            </IconMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <IconMenuItem icon={LogoutIcon} onClick={() => signOut()}>
          Cerrar sesión
        </IconMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type AnimatedIcon = React.ForwardRefExoticComponent<
  { size?: number; className?: string } & React.RefAttributes<{
    startAnimation: () => void
    stopAnimation: () => void
  }>
>

// Opción del menú con ícono de Lucide Animated: se anima al pasar el mouse o con el teclado.
function IconMenuItem({
  icon: Icon,
  children,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem> & { icon: AnimatedIcon }) {
  const { iconRef, triggerProps } = useIconAnimation()
  return (
    <DropdownMenuItem {...props} {...triggerProps} className={cn("rounded-md px-2.5 py-2", className)}>
      <Icon ref={iconRef} size={16} className="pointer-events-none" />
      {children}
    </DropdownMenuItem>
  )
}
