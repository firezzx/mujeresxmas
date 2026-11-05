import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Link con forma de botón: es la forma estándar de los CTAs que navegan.
export const pillLinkVariants = cva(
  "group/pill inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-all duration-300 ease-premium outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.12),0_1px_2px_0_rgb(0_0_0/0.12),0_4px_16px_-4px_rgb(0_0_0/0.25)] hover:bg-primary/90",
        outline:
          "border border-border bg-background/60 text-foreground backdrop-blur hover:border-foreground/20 hover:bg-background",
        ghost: "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-[15px]",
        xl: "h-14 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
)

type PillLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof pillLinkVariants>

export function PillLink({ className, variant, size, ...props }: PillLinkProps) {
  return (
    <Link
      className={cn(pillLinkVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Flecha que se desplaza al pasar el mouse por el PillLink que la contiene.
export function PillArrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="transition-[translate] duration-300 ease-premium group-hover/pill:translate-x-0.5"
    >
      <path
        d="M3 8h10m0 0L9 4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
