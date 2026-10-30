import { cn } from "@/lib/utils"

// Piezas compartidas del Shimmer Button de Magic UI, usadas por ShimmerLink (navega)
// y ShimmerSubmit (envía formularios), para que ambos se vean idénticos.

export const shimmerSizes = {
  md: "min-h-11 px-5 py-2 text-sm sm:px-6",
  lg: "min-h-14 px-5 py-2 text-[14px] min-[360px]:px-6 min-[360px]:text-[15px] sm:px-8",
}

export const shimmerStyle = {
  "--spread": "90deg",
  "--shimmer-color": "oklch(1 0 0 / 0.9)",
  "--speed": "3s",
  "--cut": "0.06em",
  "--bg": "var(--primary)",
} as React.CSSProperties

export function shimmerClassName(size: keyof typeof shimmerSizes, className?: string) {
  return cn(
    "group relative z-0 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full max-w-full text-center leading-snug font-medium text-balance text-primary-foreground [background:var(--bg)]",
    // Tailwind v4 mueve con `translate` (no `transform`): por eso se transiciona esa propiedad
    "shadow-[0_1px_2px_0_rgb(0_0_0/0.15),0_8px_24px_-8px_rgb(40_20_40/0.45)] transition-[translate,box-shadow,opacity] duration-500 ease-premium",
    "outline-none hover:-translate-y-0.5 hover:shadow-[0_2px_4px_0_rgb(0_0_0/0.15),0_14px_32px_-10px_rgb(40_20_40/0.55)] focus-visible:ring-3 focus-visible:ring-ring/40 active:translate-y-0",
    shimmerSizes[size],
    className
  )
}

// Destello del borde (va antes del contenido)
export function ShimmerSpark() {
  return (
    <span aria-hidden className="@container-[size] absolute inset-0 -z-30 overflow-visible blur-[2px]">
      <span className="absolute inset-0 aspect-square h-[100cqh] animate-shimmer-slide rounded-none [mask:none]">
        <span className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
      </span>
    </span>
  )
}

// Brillo interno y fondo (van después del contenido)
export function ShimmerBackdrop() {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 rounded-full shadow-[inset_0_-8px_10px_#ffffff1f] transition-shadow duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]"
      />
      <span aria-hidden className="absolute inset-(--cut) -z-20 rounded-full [background:var(--bg)]" />
    </>
  )
}
