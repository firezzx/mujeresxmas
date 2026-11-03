"use client"

import { AnimatePresence } from "motion/react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"

import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { XIcon, type XIconHandle } from "@/components/icons/x"
import { AnimatedListItem } from "@/components/ui/animated-list"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import { cn } from "@/lib/utils"

// Avisos flotantes del sitio: aparecen abajo a la derecha con el rebote de Animated List de
// Magic UI y se van solos (salvo que el mouse esté encima). Se disparan con useToast().

export type ToastTone = "error" | "success" | "notice"

export type ToastInput = {
  // Mismo id = reemplaza al aviso anterior (p. ej. el mismo formulario enviado dos veces)
  id?: string
  tone?: ToastTone
  title: string
  message?: React.ReactNode
  // Link o acción opcional debajo del texto
  action?: React.ReactNode
  // Milisegundos en pantalla; 0 = hasta que la cierren
  duration?: number
}

type Toast = Required<Pick<ToastInput, "id" | "tone" | "title" | "duration">> &
  Pick<ToastInput, "message" | "action"> & { key: number }

const TONES: Record<ToastTone, { icon: IconName; badge: string; ring: string; duration: number }> = {
  error: {
    icon: "badge-alert",
    badge: "bg-destructive/10 text-destructive",
    ring: "border-destructive/20",
    duration: 8000,
  },
  success: { icon: "circle-check", badge: "bg-brand-green text-foreground", ring: "border-brand-green/40", duration: 5000 },
  notice: { icon: "bell", badge: "bg-brand-soft text-foreground", ring: "border-border", duration: 9000 },
}

// Cuántos avisos se apilan como máximo
const MAX_TOASTS = 3

type ToastApi = { toast: (input: ToastInput) => void; dismiss: (id: string) => void }
const ToastContext = createContext<ToastApi | null>(null)

export function useToast() {
  const api = useContext(ToastContext)
  if (!api) throw new Error("useToast tiene que usarse dentro de <Toaster>")
  return api
}

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextKey = useRef(0)

  const dismiss = useCallback((id: string) => setToasts((list) => list.filter((t) => t.id !== id)), [])

  const toast = useCallback((input: ToastInput) => {
    const tone = input.tone ?? "notice"
    nextKey.current += 1
    const item: Toast = {
      id: input.id ?? `toast-${nextKey.current}`,
      tone,
      title: input.title,
      message: input.message,
      action: input.action,
      duration: input.duration ?? TONES[tone].duration,
      // Clave nueva en cada disparo: el aviso vuelve a entrar animado aunque tenga el mismo id
      key: nextKey.current,
    }
    setToasts((list) => [...list.filter((t) => t.id !== item.id), item].slice(-MAX_TOASTS))
  }, [])

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section
        aria-label="Avisos"
        className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[70] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2 sm:right-6 sm:bottom-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <AnimatedListItem key={item.key}>
              <ToastCard toast={item} />
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </section>
    </ToastContext.Provider>
  )
}

function ToastCard({ toast }: { toast: Toast }) {
  const style = TONES[toast.tone]
  const { dismiss } = useToast()
  const onClose = useCallback(() => dismiss(toast.id), [dismiss, toast.id])
  const [paused, setPaused] = useState(false)
  const { iconRef, triggerProps } = useIconAnimation<XIconHandle>()

  // Se cierra solo; con el mouse encima espera
  useEffect(() => {
    if (!toast.duration || paused) return
    const timer = setTimeout(onClose, toast.duration)
    return () => clearTimeout(timer)
  }, [toast.duration, paused, onClose])

  return (
    <IconHoverArea
      role={toast.tone === "error" ? "alert" : "status"}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className={cn(
        "pointer-events-auto relative flex items-start gap-3 rounded-lg border bg-background/95 p-3 pr-10 shadow-[0_18px_48px_-18px_rgb(26_26_26/0.45)] backdrop-blur-xl",
        style.ring
      )}
    >
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md", style.badge)}>
        <HoverIcon name={style.icon} size={16} autoPlay />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-sm leading-snug font-medium">{toast.title}</p>
        {toast.message && (
          <div className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{toast.message}</div>
        )}
        {toast.action && <div className="mt-2 text-[13px] font-medium">{toast.action}</div>}
      </div>
      <button
        type="button"
        onClick={onClose}
        {...triggerProps}
        aria-label="Cerrar aviso"
        className="absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
      >
        <XIcon ref={iconRef} size={14} className="pointer-events-none" />
      </button>
    </IconHoverArea>
  )
}
