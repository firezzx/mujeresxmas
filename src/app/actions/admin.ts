"use server"

import { refresh } from "next/cache"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { ROUTES } from "@/config/navigation"
import { ADMIN_PENDING_COOKIE, getAdminView, MEMBER_VIEW_COOKIE } from "@/lib/admin"

// Activa o desactiva "Ver como usuaria". Solo para administradoras.
export async function setMemberView(on: boolean) {
  if (!(await getAdminView())) return

  const store = await cookies()
  if (on) {
    store.set(MEMBER_VIEW_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    })
  } else {
    store.delete(MEMBER_VIEW_COOKIE)
  }

  // refresh: si ya estaba en la página de destino (p. ej. /admin), que se vuelva a renderizar
  refresh()
  redirect(on ? ROUTES.miCuenta : ROUTES.admin)
}

// Muestra u oculta en el panel las secciones que todavía no se usan. Solo para administradoras.
export async function setShowPendingSections(on: boolean) {
  if (!(await getAdminView())) return

  const store = await cookies()
  if (on) {
    store.set(ADMIN_PENDING_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    })
  } else {
    store.delete(ADMIN_PENDING_COOKIE)
  }
  refresh()
}
