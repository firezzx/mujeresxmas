"use client"

import { useRef } from "react"

type AnimatedIconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

// Los íconos de Lucide Animated se animan solos al pasar el mouse sobre el ícono.
// Este hook hace que se animen al pasar sobre todo el botón (y con foco de teclado).
export function useIconAnimation<T extends AnimatedIconHandle>() {
  const iconRef = useRef<T>(null)
  const start = () => iconRef.current?.startAnimation()
  const stop = () => iconRef.current?.stopAnimation()

  return {
    iconRef,
    triggerProps: {
      onMouseEnter: start,
      onMouseLeave: stop,
      onFocus: start,
      onBlur: stop,
    },
  }
}
