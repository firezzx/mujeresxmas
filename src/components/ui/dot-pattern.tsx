import { useId } from "react"

import { cn } from "@/lib/utils"

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  cr?: number
}

// Dot Pattern de Magic UI, adaptado: un solo <pattern> de SVG en vez de un elemento animado por
// cada punto, para no cargar la página con miles de círculos. El color lo da `text-*`.
export function DotPattern({ width = 16, height = 16, cr = 1, className, ...props }: DotPatternProps) {
  const id = useId()

  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} {...props}>
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={cr} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
