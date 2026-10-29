import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
  return (
    <Link
      {...props}
      className={cn(
        "group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-background/70 max-w-full text-center leading-snug font-medium text-balance backdrop-blur",
        "transition-[border-color,transform] duration-300 ease-premium outline-none hover:border-brand focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.98]",
        sizes[size],
        className
      )}
    >
      <span className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="size-2 rounded-full bg-brand transition-transform duration-500 ease-premium group-hover:scale-[60] group-focus-visible:scale-[60]"
        />
        <span className="transition-all duration-300 ease-premium group-hover:translate-x-10 group-hover:opacity-0 group-focus-visible:translate-x-10 group-focus-visible:opacity-0">
          {children}
        </span>
      </span>
      <span
        aria-hidden
        className="absolute inset-0 z-10 flex translate-x-10 items-center justify-center gap-2 text-brand-foreground opacity-0 transition-all duration-300 ease-premium group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      >
        {children}
        <ArrowRight className="size-4" />
      </span>
    </Link>
  )
}
