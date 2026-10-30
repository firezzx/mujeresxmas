"use client"

import { useEffect, useEffectEvent, useId } from "react"

import { useToast } from "@/components/toast/toaster"

const TITLES = {
  error: "Algo no salió bien",
  success: "Listo",
} as const

type FormMessageProps = {
  message?: React.ReactNode
  tone?: keyof typeof TITLES
  // Valor que cambia en cada envío (el estado de la acción): cada cambio vuelve a mostrar el
  // aviso aunque el texto sea el mismo de antes
  trigger: unknown
}

// Mensaje general de un formulario (error o confirmación). No se dibuja dentro del formulario:
// sale como aviso flotante abajo a la derecha (ver Toaster).
export function FormMessage({ message, tone = "error", trigger }: FormMessageProps) {
  const { toast } = useToast()
  const id = useId()

  // useEffectEvent: lee el mensaje actual sin que cada render dispare un aviso nuevo
  const show = useEffectEvent(() => {
    if (message) toast({ id, tone, title: TITLES[tone], message })
  })

  useEffect(() => {
    show()
  }, [trigger])

  return null
}
