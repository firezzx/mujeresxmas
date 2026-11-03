"use client"

import { motion } from "motion/react"
import { useEffect, useRef } from "react"

import { CheckIcon, type CheckIconHandle } from "@/components/icons/check"
import { PASSWORD_RULES } from "@/lib/validations/auth"
import { cn } from "@/lib/utils"

// Tilde de un requisito: aparece y se dibuja (animación de Lucide Animated) al cumplirse.
function RuleCheck({ ok }: { ok: boolean }) {
  const iconRef = useRef<CheckIconHandle>(null)

  useEffect(() => {
    if (ok) iconRef.current?.startAnimation()
  }, [ok])

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 items-center justify-center rounded-full transition-colors duration-300",
        ok ? "bg-brand-green text-foreground" : "bg-foreground/[0.07]"
      )}
    >
      <motion.span
        initial={false}
        animate={{ scale: ok ? 1 : 0, opacity: ok ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <CheckIcon ref={iconRef} size={10} className="pointer-events-none [&_svg]:stroke-[3.5]" />
      </motion.span>
    </span>
  )
}

// Requisitos de la contraseña que se van tildando mientras se escribe.
export function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul aria-label="Requisitos de la contraseña" className="flex flex-wrap gap-x-4 gap-y-1.5">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(value)
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-1.5 text-[13px] transition-colors duration-300",
              ok ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <RuleCheck ok={ok} />
            {rule.label}
            <span className="sr-only">{ok ? "(cumplido)" : "(pendiente)"}</span>
          </li>
        )
      })}
    </ul>
  )
}
