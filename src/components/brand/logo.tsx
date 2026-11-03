import { LOGO_LETTERS, LOGO_VIEW_BOX } from "@/components/brand/logo-letters"
import { cn } from "@/lib/utils"

// Segundos entre el arranque de una letra y la siguiente
const LETTER_STAGGER = 0.05

type LogoProps = {
  className?: string
  // "play": las letras entran una por una. "waiting": todavía no se ve (el header está cargando
  // la sesión; se monta de nuevo al terminar y así la animación no arranca dos veces).
  entrance?: "waiting" | "play"
}

// Logo principal de la marca. El alto se pasa por className y el ancho sale solo.
export function Logo({ className, entrance }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      role="img"
      aria-label="Mujeres x Más"
      className={cn("w-auto shrink-0 fill-brand-green", entrance === "waiting" && "opacity-0", className)}
    >
      {LOGO_LETTERS.map((letter, index) => (
        <path
          key={`${letter.name}-${index}`}
          d={letter.d}
          fillRule="evenodd"
          className={entrance === "play" ? "animate-logo-letter motion-reduce:[animation-delay:0s]!" : undefined}
          style={entrance === "play" ? { animationDelay: `${index * LETTER_STAGGER}s` } : undefined}
        />
      ))}
    </svg>
  )
}

// Versión corta para espacios chicos (header en celular). Provisoria en texto hasta que llegue la
// versión corta del logo.
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
