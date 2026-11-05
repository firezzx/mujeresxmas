"use client"

import { useLayoutEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction = "highlight" | "underline" | "box" | "circle" | "strike-through" | "crossed-off" | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  // Adaptado: separación relativa al tamaño de letra, en em. Si se pasa, reemplaza a padding. Negativa
  // acerca el subrayado al texto, porque la caja de la tipografía baja bastante más que las letras.
  paddingEm?: number
  multiline?: boolean
  isView?: boolean
  // Adaptado: deja que el texto se parta en varias líneas y subraya cada una
  inline?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  paddingEm,
  multiline = true,
  isView = false,
  inline = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView

  useLayoutEffect(() => {
    const element = elementRef.current
    let annotation: RoughAnnotation | null = null
    let resizeObserver: ResizeObserver | null = null

    if (shouldShow && element) {
      const currentPadding = () =>
        paddingEm === undefined ? padding : paddingEm * parseFloat(getComputedStyle(element).fontSize)

      const annotationConfig = {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding: currentPadding(),
        multiline,
      }

      const currentAnnotation = annotate(element, annotationConfig)
      annotation = currentAnnotation
      currentAnnotation.show()

      // Adaptado: se redibuja sin animar y solo si el texto cambió de lugar o de ancho (cambio de
      // tipografía, giro de pantalla). Así no se repite el trazo cada vez que crece la página.
      const parent = element.parentElement ?? element
      const measure = () => {
        const box = element.getBoundingClientRect()
        return `${box.left - parent.getBoundingClientRect().left}:${box.width}`
      }
      let lastMeasure = measure()
      const redraw = () => {
        const current = measure()
        if (current === lastMeasure) return
        lastMeasure = current
        currentAnnotation.animate = false
        currentAnnotation.padding = currentPadding()
        currentAnnotation.hide()
        currentAnnotation.show()
      }

      resizeObserver = new ResizeObserver(redraw)
      resizeObserver.observe(element)
      resizeObserver.observe(parent)
      document.fonts?.ready.then(redraw)
    }

    return () => {
      annotation?.remove()
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [shouldShow, action, color, strokeWidth, animationDuration, iterations, padding, paddingEm, multiline])

  return (
    <span ref={elementRef} className={inline ? "relative inline bg-transparent" : "relative inline-block bg-transparent"}>
      {children}
    </span>
  )
}
