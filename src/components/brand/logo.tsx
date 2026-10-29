import { cn } from "@/lib/utils"

// Logotipo provisorio en texto. Cuando llegue el logo de la marca, se reemplaza solo este componente.
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading text-[1.35rem] leading-none tracking-tight whitespace-nowrap",
        className
      )}
    >
      Mujeres <span className="text-brand italic">x</span> Más
    </span>
  )
}
