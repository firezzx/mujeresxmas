"use client"

import { type CSSProperties } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

// Light Rays de Magic UI, adaptado: los rayos se calculan siempre igual en vez de usar valores al azar
// después de montar, así el servidor y el navegador dibujan lo mismo y no hay salto al cargar.
const GOLDEN_RATIO = 0.618

function createRays(count: number, cycle: number) {
  return Array.from({ length: count }, (_, index) => {
    const step = ((index + 1) * GOLDEN_RATIO) % 1
    return {
      id: index,
      left: 8 + step * 84,
      rotate: -28 + step * 56,
      width: 160 + step * 160,
      swing: 0.8 + step * 1.8,
      delay: step * cycle,
      duration: cycle * (0.75 + step * 0.5),
      intensity: 0.6 + step * 0.5,
    }
  })
}

export function LightRays({
  className,
  count = 7,
  color,
  blur = 36,
  speed = 14,
  length = "70vh",
}: {
  className?: string
  count?: number
  color: string
  blur?: number
  speed?: number
  length?: string
}) {
  const rays = createRays(count, Math.max(speed, 0.1))

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 isolate overflow-hidden", className)}
      style={
        {
          "--light-rays-color": color,
          "--light-rays-blur": `${blur}px`,
          "--light-rays-length": length,
        } as CSSProperties
      }
    >
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute -top-[12%] left-[var(--ray-left)] h-[var(--light-rays-length)] w-[var(--ray-width)] origin-top -translate-x-1/2 rounded-full bg-linear-to-b from-[color-mix(in_srgb,var(--light-rays-color)_70%,transparent)] to-transparent opacity-0 mix-blend-screen blur-[var(--light-rays-blur)]"
          style={{ "--ray-left": `${ray.left}%`, "--ray-width": `${ray.width}px` } as CSSProperties}
          initial={{ rotate: ray.rotate }}
          animate={{
            opacity: [0, ray.intensity, 0],
            rotate: [ray.rotate - ray.swing, ray.rotate + ray.swing, ray.rotate - ray.swing],
          }}
          transition={{
            duration: ray.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ray.delay,
            repeatDelay: ray.duration * 0.1,
          }}
        />
      ))}
    </div>
  )
}
