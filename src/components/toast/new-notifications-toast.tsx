"use client"

import { usePathname } from "next/navigation"
import { useEffect, useEffectEvent } from "react"

import { setNotificationsOpen } from "@/components/notifications/notifications-store"
import { useToast } from "@/components/toast/toaster"
import { ROUTES } from "@/config/navigation"

// Recuerda en el navegador qué avisos ya se mostraron, para no repetirlos en cada página
const SEEN_KEY = "mxm_avisos_vistos"
const TOAST_ID = "notificaciones-nuevas"

type NewNotificationsToastProps = {
  // Notificaciones sin leer, de la más nueva a la más vieja
  unread: { id: string; title: string }[]
}

// Al entrar al sitio con notificaciones sin leer, avisa abajo a la derecha una sola vez por
// notificación. En Mi cuenta no hace falta: ahí ya se ven.
export function NewNotificationsToast({ unread }: NewNotificationsToastProps) {
  const { toast, dismiss } = useToast()
  const pathname = usePathname()
  const latestId = unread[0]?.id

  const show = useEffectEvent(() => {
    if (!latestId || pathname === ROUTES.miCuenta) return

    let seen: string[] = []
    try {
      seen = JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? "[]")
    } catch {}
    const fresh = unread.filter((n) => !seen.includes(n.id))
    if (!fresh.length) return

    try {
      sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seen, ...fresh.map((n) => n.id)].slice(-50)))
    } catch {}

    toast({
      id: TOAST_ID,
      tone: "notice",
      title: fresh.length === 1 ? "Tenés una notificación nueva" : `Tenés ${fresh.length} notificaciones nuevas`,
      message: fresh[0].title,
      action: (
        <button
          type="button"
          onClick={() => {
            dismiss(TOAST_ID)
            setNotificationsOpen(true)
          }}
          className="cursor-pointer text-foreground underline decoration-brand underline-offset-4"
        >
          Ver notificaciones
        </button>
      ),
    })
  })

  useEffect(() => {
    show()
  }, [latestId])

  return null
}
