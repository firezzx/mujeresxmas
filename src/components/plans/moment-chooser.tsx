"use client"

import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { MEMBERSHIP_MOMENTS } from "@/content/membresia"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

// "¿En qué momento estás?": tres opciones que resaltan la membresía recomendada en las tarjetas de
// abajo (las tarjetas vienen del servidor como children; el resaltado lo hace el CSS de globals.css
// según data-moment). Volver a tocar la opción elegida la deselecciona.
export function MomentChooser({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null)
  const current = MEMBERSHIP_MOMENTS.options.find((option) => option.planId === selected)

  return (
    <div className="flex flex-col items-center">
      <p id="momento" className="font-heading text-sm font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        {MEMBERSHIP_MOMENTS.label}
      </p>
      <div
        role="group"
        aria-labelledby="momento"
        className="mt-4 grid w-full max-w-3xl grid-cols-1 gap-2 rounded-xl bg-background/70 p-1.5 shadow-[0_16px_40px_-24px_rgb(26_26_26/0.3)] ring-1 ring-foreground/[0.08] backdrop-blur-md sm:grid-cols-3"
      >
        {MEMBERSHIP_MOMENTS.options.map((option) => {
          const active = option.planId === selected
          return (
            <IconHoverArea key={option.planId}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(active ? null : option.planId)}
                className={cn(
                  "relative isolate flex w-full items-center justify-center gap-2.5 rounded-lg px-4 py-3 text-[15px] font-medium transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                  active ? "text-primary-foreground" : "text-foreground hover:bg-foreground/[0.04]"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="moment-pill"
                    transition={{ duration: 0.45, ease }}
                    className="absolute inset-0 -z-10 rounded-lg bg-primary"
                  />
                )}
                <HoverIcon
                  name={option.icon}
                  size={18}
                  className={active ? "text-brand-green" : "text-brand-green-strong"}
                />
                {option.label}
              </button>
            </IconHoverArea>
          )
        })}
      </div>
      <div aria-live="polite" className="mt-4 flex min-h-12 max-w-xl items-start justify-center text-center">
        <AnimatePresence mode="wait" initial={false}>
          {current && (
            <motion.p
              key={current.planId}
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease }}
              className="text-[15px] leading-relaxed text-pretty text-muted-foreground"
            >
              {current.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div data-moment={selected ?? ""} className="mt-4 w-full">
        {children}
      </div>
    </div>
  )
}
