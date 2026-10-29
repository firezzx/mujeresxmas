import Link from "next/link"
import { UserIcon } from "lucide-react"

import { RegistroCta } from "@/components/registro-cta"
import { UserMenu } from "@/components/site-header/user-menu"
import { ROUTES } from "@/config/navigation"
import { getCurrentUser } from "@/lib/supabase/user"

// Lee la sesión en el servidor: con sesión muestra el avatar, sin sesión los accesos.
export async function UserSlot() {
  const user = await getCurrentUser()

  if (user) return <UserMenu user={user} />

  return (
    <>
      <Link
        href={ROUTES.login}
        aria-label="Iniciar sesión"
        className="inline-flex h-9 items-center gap-2 rounded-full px-2 text-sm font-medium hover:bg-muted sm:px-3"
      >
        <UserIcon className="size-5" />
        <span className="hidden sm:inline">Iniciar sesión</span>
      </Link>
      <RegistroCta className="px-4 py-2 text-sm">Registrarme</RegistroCta>
    </>
  )
}

export function UserSlotSkeleton() {
  return <div aria-hidden className="size-9 animate-pulse rounded-full bg-muted" />
}
