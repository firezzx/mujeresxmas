"use client"

import { AnimatePresence, motion } from "motion/react"
import { useId, useState } from "react"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { cardClass } from "@/components/landing/landing-ui"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const

type FaqItem = { question: string; answer: string }

// Preguntas frecuentes: se abren de a una, con el alto, la respuesta y el ícono animados.
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const baseId = useId()

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = open === index
        const buttonId = `${baseId}-q${index}`
        const panelId = `${baseId}-a${index}`
        return (
          <li key={item.question}>
            <BlurFade inView delay={index * 0.05}>
              <IconHoverArea
                className={cardClass(
                  "white",
                  cn(
                    "transition-shadow duration-500 ease-premium",
                    isOpen && "shadow-[0_1px_2px_rgb(26_26_26/0.04),0_28px_56px_-28px_rgb(26_26_26/0.3)]"
                  )
                )}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 rounded-xl px-6 py-5 text-left font-heading text-lg font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                  >
                    {item.question}
                    <motion.span
                      aria-hidden
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease }}
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
                        isOpen ? "bg-brand-green text-primary" : "bg-brand-green/15 text-brand-green-strong"
                      )}
                    >
                      <HoverIcon name="plus" size={16} />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.45, ease }, opacity: { duration: 0.3, ease } }}
                      className="overflow-hidden"
                    >
                      <motion.p
                        initial={{ y: -6 }}
                        animate={{ y: 0 }}
                        exit={{ y: -6 }}
                        transition={{ duration: 0.45, ease }}
                        className="px-6 pb-6 text-base leading-relaxed text-pretty text-muted-foreground"
                      >
                        {item.answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </IconHoverArea>
            </BlurFade>
          </li>
        )
      })}
    </ul>
  )
}
