"use client"

import { useRouter } from "next/navigation"

import { ShimmerButton } from "@/components/ui/shimmer-button"

// ShimmerButton es un <button>: navegamos por código para no anidarlo dentro de un <a>.
export function RegistroCta() {
  const router = useRouter()

  return (
    <ShimmerButton
      onClick={() => router.push("/registro")}
      className="px-6 py-3 text-base font-medium"
    >
      Registrarme en Mujeres x Más
    </ShimmerButton>
  )
}
