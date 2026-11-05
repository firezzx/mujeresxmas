import { cn } from "@/lib/utils"

// Estilo del botón principal, compartido por ShimmerLink (navega) y ShimmerSubmit (envía formularios)
// para que ambos se vean idénticos: liso, naranja y con texto negro.

export const shimmerSizes = {
  md: "min-h-11 px-5 py-2 text-sm sm:px-6",
  lg: "min-h-14 px-5 py-2 text-[14px] min-[360px]:px-6 min-[360px]:text-[15px] sm:px-8",
}

export function shimmerClassName(size: keyof typeof shimmerSizes, className?: string) {
  return cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-lg max-w-full bg-brand text-center leading-snug font-medium text-balance text-brand-foreground",
    "transition-opacity duration-300 outline-none hover:opacity-85 focus-visible:ring-3 focus-visible:ring-ring/40",
    shimmerSizes[size],
    className
  )
}
