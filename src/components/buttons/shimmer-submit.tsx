"use client"

import { LoaderCircle } from "lucide-react"

import {
  ShimmerBackdrop,
  shimmerClassName,
  type shimmerSizes,
  ShimmerSpark,
  shimmerStyle,
} from "@/components/buttons/shimmer"
import { ArrowRightIcon, type ArrowRightIconHandle } from "@/components/icons/arrow-right"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import { cn } from "@/lib/utils"

type ShimmerSubmitProps = Omit<React.ComponentProps<"button">, "type"> & {
  size?: keyof typeof shimmerSizes
  pending?: boolean
  pendingLabel?: string
}

// Botón de envío de formularios con el mismo aspecto que ShimmerLink.
export function ShimmerSubmit({
  children,
  size = "lg",
  pending = false,
  pendingLabel = "Enviando…",
  className,
  disabled,
  ...props
}: ShimmerSubmitProps) {
  const { iconRef, triggerProps } = useIconAnimation<ArrowRightIconHandle>()

  return (
    <button
      {...props}
      {...triggerProps}
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      style={shimmerStyle}
      className={shimmerClassName(size, cn("cursor-pointer disabled:cursor-wait disabled:opacity-80", className))}
    >
      <ShimmerSpark />
      <span className="relative">{pending ? pendingLabel : children}</span>
      {pending ? (
        <LoaderCircle aria-hidden className="relative -mr-1 size-[18px] shrink-0 animate-spin" />
      ) : (
        <ArrowRightIcon ref={iconRef} size={18} className="relative -mr-1 shrink-0" />
      )}
      <ShimmerBackdrop />
    </button>
  )
}
