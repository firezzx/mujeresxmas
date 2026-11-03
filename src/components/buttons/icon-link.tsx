"use client"

import Link from "next/link"

import { useIconAnimation } from "@/hooks/use-icon-animation"
import { cn } from "@/lib/utils"

type AnimatedIcon = React.ForwardRefExoticComponent<
  { size?: number; className?: string } & React.RefAttributes<{
    startAnimation: () => void
    stopAnimation: () => void
  }>
>

type IconLinkProps = Omit<React.ComponentProps<typeof Link>, "children"> & {
  icon: AnimatedIcon
  label: string
  variant?: "ghost" | "solid"
}

// Botón redondo con un ícono animado de Lucide Animated.
// El texto queda para lectores de pantalla y aparece como etiqueta al pasar el mouse.
export function IconLink({
  icon: Icon,
  label,
  variant = "ghost",
  className,
  ...props
}: IconLinkProps) {
  const { iconRef, triggerProps } = useIconAnimation()

  return (
    <Link
      {...props}
      {...triggerProps}
      aria-label={label}
      className={cn(
        "group/icon relative inline-flex size-10 shrink-0 items-center justify-center rounded-lg transition-[translate,scale,background-color,box-shadow] duration-500 ease-premium outline-none focus-visible:ring-3 focus-visible:ring-ring/40 active:scale-95",
        variant === "solid"
          ? "bg-primary text-primary-foreground shadow-[0_1px_2px_0_rgb(0_0_0/0.15),0_6px_16px_-6px_rgb(26_26_26/0.45)] hover:-translate-y-0.5"
          : "text-foreground ring-1 ring-border hover:bg-foreground/5 hover:ring-foreground/20",
        className
      )}
    >
      <Icon ref={iconRef} size={19} className="pointer-events-none" />
      <span
        aria-hidden
        className="pointer-events-none absolute top-full left-1/2 mt-2.5 -translate-x-1/2 translate-y-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium whitespace-nowrap text-primary-foreground opacity-0 shadow-lg transition-all duration-200 ease-premium group-hover/icon:translate-y-0 group-hover/icon:opacity-100 max-md:hidden"
      >
        {label}
      </span>
    </Link>
  )
}
