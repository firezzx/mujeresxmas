import {
  LOGO_LETTERS,
  LOGO_MX_M,
  LOGO_MX_M_TRANSFORM,
  LOGO_MX_PLUS,
  LOGO_MX_VIEW_BOX,
  LOGO_MX_X,
  LOGO_MX_X_TRANSFORM,
  LOGO_VIEW_BOX,
} from "@/components/brand/logo-letters"
import { cn } from "@/lib/utils"

// Segundos entre el arranque de una letra y la siguiente
const LETTER_STAGGER = 0.05

type LogoProps = {
  className?: string
  // "play": las letras entran una por una. "waiting": todavía no se ve (el header está cargando
  // la sesión; se monta de nuevo al terminar y así la animación no arranca dos veces).
  entrance?: "waiting" | "play"
}

// Logo principal de la marca. El alto se pasa por className y el ancho sale solo. Según el manual va
// en negro sobre verde, rosa o blanco (verde sobre blanco solo desde 300 px) y su mínimo es 120 px.
export function Logo({ className, entrance }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEW_BOX}
      role="img"
      aria-label="Mujeres x Más"
      className={cn("w-auto shrink-0 fill-foreground", entrance === "waiting" && "opacity-0", className)}
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

function LogoMxShapes() {
  return (
    <>
      <path d={LOGO_MX_M} transform={LOGO_MX_M_TRANSFORM} fillRule="evenodd" />
      <path d={LOGO_MX_X} transform={LOGO_MX_X_TRANSFORM} fillRule="evenodd" />
      <path d={LOGO_MX_PLUS} />
    </>
  )
}

// Iniciales mx+ para espacios chicos (header en celular, avatar). Mínimo: 40 px de ancho.
export function LogoShort({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOGO_MX_VIEW_BOX}
      role="img"
      aria-label="Mujeres x Más"
      className={cn("h-7 w-auto shrink-0 fill-foreground", className)}
    >
      <LogoMxShapes />
    </svg>
  )
}

const SEAL_PLUSES = [130, 870]

// Sello circular del manual. Toma el color del texto; su mínimo es 90 px y no se gira ni se inclina.
export function LogoSeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="40 40 920 920"
      role="img"
      aria-label="Mujeres x Más, crecemos juntas"
      className={cn("shrink-0 fill-current", className)}
    >
      <circle cx="500" cy="500" r="434" fill="none" stroke="currentColor" strokeWidth="18" />
      <circle cx="500" cy="500" r="310" fill="none" stroke="currentColor" strokeWidth="6" />
      <defs>
        <path id="logo-seal-top" d="M 155 500 A 345 345 0 0 1 845 500" />
        <path id="logo-seal-bottom" d="M 100 500 A 400 400 0 0 0 900 500" />
      </defs>
      <text className="font-heading" fontSize="74" fontWeight="500" letterSpacing="5" textAnchor="middle">
        <textPath href="#logo-seal-top" startOffset="50%">
          crecemos juntas
        </textPath>
      </text>
      <text className="font-heading" fontSize="74" fontWeight="500" letterSpacing="5" textAnchor="middle">
        <textPath href="#logo-seal-bottom" startOffset="50%">
          mujeresxmas.com
        </textPath>
      </text>
      {SEAL_PLUSES.map((x) => (
        <path key={x} d={`M${x - 5},484h10v11h11v10h-11v11h-10v-11h-11v-10h11z`} />
      ))}
      <svg x="315" y="432" width="370" height="135" viewBox={LOGO_MX_VIEW_BOX}>
        <LogoMxShapes />
      </svg>
    </svg>
  )
}
