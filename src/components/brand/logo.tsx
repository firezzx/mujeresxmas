import { cn } from "@/lib/utils"

// Logotipos provisorios en texto. Cuando lleguen los de la marca, se reemplazan solo estos componentes.
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading text-[1.2rem] leading-none [text-box:trim-both_cap_alphabetic] font-semibold tracking-[-0.02em] whitespace-nowrap",
        className
      )}
    >
      Mujeres <span className="text-brand">x</span> Más
    </span>
  )
}

// Versión corta para espacios chicos (header en celular).
export function LogoShort({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading text-[1.35rem] leading-none [text-box:trim-both_cap_alphabetic] font-bold tracking-[-0.03em] whitespace-nowrap",
        className
      )}
    >
      MX<span className="text-brand">+</span>
    </span>
  )
}
