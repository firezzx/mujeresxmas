"use client"

import { AnimatePresence, motion } from "motion/react"

import { HoverIcon } from "@/components/icons/hover-icon"
import { AnimatedListItem } from "@/components/ui/animated-list"
import { cn } from "@/lib/utils"

const TONES = {
  error: {
    icon: "badge-alert",
    title: "Algo no salió bien",
    box: "border-destructive/20",
    badge: "bg-destructive/10 text-destructive",
  },
  success: { icon: "circle-check", title: "Listo", box: "border-brand/25", badge: "bg-brand text-brand-foreground" },
} as const

// Mensaje general de un formulario (error o confirmación) con forma de notificación: entra con
// el rebote de Animated List de Magic UI y el ícono animado de Lucide Animated.
export function FormMessage({ message, tone = "error" }: { message?: React.ReactNode; tone?: keyof typeof TONES }) {
  const style = TONES[tone]

  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          role={tone === "error" ? "alert" : "status"}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedListItem>
            <figure
              className={cn(
                "flex items-start gap-3 rounded-2xl border bg-background p-3 shadow-[0_10px_30px_-18px_rgb(40_20_40/0.35)]",
                style.box
              )}
            >
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", style.badge)}>
                <HoverIcon name={style.icon} size={16} autoPlay />
              </span>
              <figcaption className="min-w-0 pt-0.5">
                <p className="text-sm leading-snug font-medium">{style.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{message}</p>
              </figcaption>
            </figure>
          </AnimatedListItem>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
