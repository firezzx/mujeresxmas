"use client"

import { useRef, type ReactNode } from "react"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

// Text Reveal de Magic UI, adaptado a la marca: tipografía y colores por tokens, y palabras que se
// pueden destacar. Las palabras se van encendiendo a medida que se baja por la página.
export function TextReveal({
  children,
  highlightWords = [],
  className,
}: {
  children: string
  highlightWords?: string[]
  className?: string
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef })
  const words = children.split(" ")

  return (
    <div ref={sectionRef} className={cn("relative z-0 h-[180vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-dvh max-w-5xl items-center px-5 sm:px-8">
        <p className="flex flex-wrap font-heading text-4xl leading-[1.1] font-semibold tracking-[-0.01em] sm:text-6xl lg:text-7xl">
          {words.map((word, index) => (
            <Word
              key={index}
              progress={scrollYProgress}
              range={[index / words.length, (index + 1) / words.length]}
              highlight={highlightWords.includes(word)}
            >
              {word}
            </Word>
          ))}
        </p>
      </div>
    </div>
  )
}

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
  highlight: boolean
}) {
  const opacity = useTransform(progress, range, [0, 1])
  return (
    <span className="relative mr-[0.25em]">
      <span aria-hidden className="absolute opacity-15">
        {children}
      </span>
      <motion.span style={{ opacity }} className={highlight ? "text-brand" : "text-foreground"}>
        {children}
      </motion.span>
    </span>
  )
}
