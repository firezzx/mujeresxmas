"use client"

import { animate, useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef } from "react"

const format = (value: number) => new Intl.NumberFormat("es-AR").format(Math.max(0, Math.round(value)))

// Cifra que cuenta desde cero al aparecer en pantalla. El HTML ya trae el número final, así lo ven
// los buscadores y quien tenga "reducir movimiento" activado.
export function CountUp({ value, delay = 0, className }: { value: number; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!inView || reduceMotion || !node) return
    node.textContent = format(0)
    const controls = animate(0, value, {
      delay,
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest)
      },
    })
    return () => {
      controls.stop()
      node.textContent = format(value)
    }
  }, [inView, reduceMotion, value, delay])

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}
