"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import { ShimmerLink } from "@/components/buttons/shimmer-link"

const ease = [0.22, 1, 0.36, 1] as const

type FloatingCtaProps = {
  href: string
  label: string
  // id del CTA que reemplaza: el flotante aparece cuando ese botón quedó arriba de la pantalla
  watchId: string
}

// CTA fijo abajo en celular. Queda debajo del velo del menú móvil (z-40), así no compite con él.
export function FloatingCta({ href, label, watchId }: FloatingCtaProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(watchId)
    if (!target) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [watchId])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-x-0 bottom-0 z-30 px-3 pt-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
        >
          {/* Degradé para que el botón se despegue del contenido que pasa por detrás */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"
          />
          <ShimmerLink
            href={href}
            className="relative w-full shadow-[0_16px_40px_-16px_rgb(40_20_40/0.55)]"
          >
            {label}
          </ShimmerLink>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
