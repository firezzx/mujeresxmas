"use client"

import Link from "next/link"

import { shimmerClassName, type shimmerSizes } from "@/components/buttons/shimmer"
import { ArrowRightIcon, type ArrowRightIconHandle } from "@/components/icons/arrow-right"
import { useIconAnimation } from "@/hooks/use-icon-animation"

type ShimmerLinkProps = Omit<React.ComponentProps<typeof Link>, "children"> & {
  children: React.ReactNode
  size?: keyof typeof shimmerSizes
  arrow?: boolean
}

// CTA principal: el Shimmer Button de Magic UI adaptado a link (navega como un <a> real)
// con la flecha animada de Lucide Animated.
export function ShimmerLink({
  children,
  size = "lg",
  arrow = true,
  className,
  ...props
}: ShimmerLinkProps) {
  const { iconRef, triggerProps } = useIconAnimation<ArrowRightIconHandle>()

  return (
    <Link
      {...props}
      {...triggerProps}
      className={shimmerClassName(size, className)}
    >
      <span className="relative">{children}</span>
      {arrow && <ArrowRightIcon ref={iconRef} size={18} className="relative -mr-1 shrink-0" />}
    </Link>
  )
}
