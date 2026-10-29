"use client"

import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

// Mensaje general de un formulario (error o aviso), con aparición suave.
export function FormMessage({
  message,
  tone = "error",
}: {
  message?: React.ReactNode
  tone?: "error" | "info"
}) {
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
          <p
            className={cn(
              "rounded-2xl px-4 py-3 text-sm",
              tone === "error" ? "bg-destructive/[0.07] text-destructive" : "bg-foreground/[0.05] text-foreground"
            )}
          >
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
