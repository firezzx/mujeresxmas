"use client"

import { useRouter } from "next/navigation"

import { ShimmerButton } from "@/components/ui/shimmer-button"
import { ROUTES } from "@/config/navigation"
import { cn } from "@/lib/utils"

// ShimmerButton es un <button>: navegamos por código para no anidarlo dentro de un <a>.
export function RegistroCta({
  className,
  children = "Registrarme en Mujeres x Más",
}: {
  className?: string
  children?: React.ReactNode
}) {
  const router = useRouter()

  return (
    <ShimmerButton
      onClick={() => router.push(ROUTES.registro)}
      background="var(--primary)"
      className={cn("px-6 py-3 text-base font-medium", className)}
    >
      {children}
    </ShimmerButton>
  )
}
