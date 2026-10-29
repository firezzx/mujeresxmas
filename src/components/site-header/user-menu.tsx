"use client"

import Link from "next/link"
import { LogOutIcon, UserRoundIcon } from "lucide-react"

import { signOut } from "@/app/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROUTES } from "@/config/navigation"
import type { CurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"

function initials(user: CurrentUser) {
  const fromName = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((part) => part!.charAt(0))
    .join("")
  return (fromName || user.email?.charAt(0) || "?").toUpperCase()
}

export function UserAvatar({
  user,
  className,
}: {
  user: CurrentUser
  className?: string
}) {
  return (
    <Avatar className={cn("size-9", className)}>
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
      <AvatarFallback className="bg-brand-soft font-medium text-foreground">
        {initials(user)}
      </AvatarFallback>
    </Avatar>
  )
}

export function UserMenu({ user }: { user: CurrentUser }) {
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "Mi cuenta"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir menú de mi cuenta"
        className="rounded-full p-0.5 ring-1 ring-border transition-shadow outline-none hover:ring-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 rounded-2xl p-1.5 shadow-[0_16px_48px_-16px_rgb(40_20_40/0.3)]"
      >
        <div className="flex items-center gap-3 px-2.5 py-2.5">
          <UserAvatar user={user} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-xl px-2.5 py-2"
          render={<Link href={ROUTES.miCuenta} />}
        >
          <UserRoundIcon />
          Mi cuenta
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rounded-xl px-2.5 py-2"
          onClick={() => signOut()}
        >
          <LogOutIcon />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
