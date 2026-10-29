import { cn } from "@/lib/utils"

// Logotipo provisorio en texto. Cuando llegue el logo de la marca, se reemplaza solo este componente.
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading text-[1.2rem] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap",
        className
      )}
    >
      Mujeres <span className="text-brand">x</span> Más
    </span>
  )
}
