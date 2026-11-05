"use client"

import { useSyncExternalStore } from "react"

// Estado del panel de notificaciones. El panel vive junto al header, pero se abre desde lugares que no
// comparten árbol de componentes: la campana, el menú de la cuenta, el aviso flotante y Mi cuenta.
let open = false
const listeners = new Set<() => void>()

export function setNotificationsOpen(next: boolean) {
  if (open === next) return
  open = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useNotificationsOpen() {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false
  )
}
