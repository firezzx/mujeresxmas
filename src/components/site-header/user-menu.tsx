"use client"

import Link from "next/link"
import { LogOutIcon, UserRoundIcon } from "lucide-react"

import { signOut } from "@/app/actions/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROUTES } from "@/config/navigation"
import type { CurrentUser } from "@/lib/supabase/user"

function initials(user: CurrentUser) {
  const fromName = [user.firstName, user.lastName]
    .filter(Boolean)
    .map((part) => part!.charAt(0))
    .join("")
  return (fromName || user.email?.charAt(0) || "?").toUpperCase()
}

export function UserMenu({ user }: { user: CurrentUser }) {
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Abrir menú de mi cuenta"
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar size="lg">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" />}
          <AvatarFallback>{initials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={ROUTES.miCuenta} />}>
          <UserRoundIcon />
          Mi cuenta
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
          <LogOutIcon />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
