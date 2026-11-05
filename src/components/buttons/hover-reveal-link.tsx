"use client"

import Link from "next/link"

import { ArrowRightIcon, type ArrowRightIconHandle } from "@/components/icons/arrow-right"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import { cn } from "@/lib/utils"

const sizes = {
  md: "min-h-11 px-5 py-2 text-sm sm:px-6",
  lg: "min-h-14 px-5 py-2 text-[14px] min-[360px]:px-6 min-[360px]:text-[15px] sm:px-8",
}

type HoverRevealLinkProps = Omit<React.ComponentProps<typeof Link>, "children"> & {
  children: React.ReactNode
  size?: keyof typeof sizes
}

// CTA secundario: el Interactive Hover Button de Magic UI adaptado a link.
// Al pasar el mouse, el punto de color crece hasta llenar el botón y aparece la flecha.
export function HoverRevealLink({
  children,
  size = "lg",
  className,
  ...props
}: HoverRevealLinkProps) {
  const { iconRef, triggerProps } = useIconAnimation<ArrowRightIconHandle>()

  return (
    <Link
      {...props}
      {...triggerProps}
      className={cn(
        "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-lg border border-border bg-background text-foreground max-w-full text-center leading-snug font-medium text-balance",
        "transition-[border-color,scale] duration-500 ease-premium outline-none hover:border-foreground focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.98]",
        sizes[size],
        className
      )}
    >
      <span className="flex items-center gap-2.5">
        {/* Punto de marca. Adentro tiene un círculo de 900px reducido al tamaño del punto: como se
            dibuja a tamaño real, el borde se ve nítido durante la animación. Crece solo hasta el
            60% (llena botones de hasta ~450px): si llegara al 100%, cubriría el botón en los
            primeros milisegundos y el relleno se vería instantáneo. Entra con una curva pareja y
            sale más rápido, para que al sacar el mouse reaccione enseguida. */}
        <span aria-hidden className="relative size-2 rounded-full bg-foreground">
          <span className="absolute top-1/2 left-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 scale-[0.009] rounded-full bg-foreground transition-[scale] duration-[450ms] ease-out group-hover:scale-60 group-hover:duration-[800ms] group-hover:ease-[cubic-bezier(0.45,0,0.3,1)] group-focus-visible:scale-60" />
        </span>
        <span className="transition-[translate,opacity] duration-[400ms] ease-premium group-hover:translate-x-10 group-hover:opacity-0 group-focus-visible:translate-x-10 group-focus-visible:opacity-0">
          {children}
        </span>
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-10 flex translate-x-10 items-center justify-center gap-2 text-white opacity-0 transition-[translate,opacity] duration-[400ms] ease-premium group-hover:translate-x-0 group-hover:delay-100 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        {children}
        <ArrowRightIcon ref={iconRef} size={16} className="pointer-events-none" />
      </span>
    </Link>
  )
}
