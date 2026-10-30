"use client"

import { MotionConfig } from "motion/react"

// Si la persona activó "reducir movimiento" en su sistema, las animaciones de Motion (y de los
// componentes de Magic UI que lo usan) se simplifican a cambios de opacidad.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
