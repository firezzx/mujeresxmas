import { cn } from "@/lib/utils"

// Fondo suave y el ícono fuerte en el mismo color de la marca, para que el ícono se note.
// El verde y el rosa usan un tono más oscuro en el ícono: los de la paleta casi no se ven sobre
// su propio fondo suave.
const TONES = {
  brand: "bg-brand/12 text-brand",
  green: "bg-brand-green/18 text-brand-green-strong",
  pink: "bg-brand-soft/45 text-brand-pink-strong",
}

const SIZES = {
  sm: "size-9 rounded-md",
  md: "size-12 rounded-lg",
  lg: "size-14 rounded-xl",
}

export type IconBadgeTone = keyof typeof TONES

const TONE_CYCLE: IconBadgeTone[] = ["brand", "green", "pink"]

// Color para el elemento número `index` de una lista: se van alternando los 3 de la marca
export function cycleTone(index: number) {
  return TONE_CYCLE[index % TONE_CYCLE.length]
}

type IconBadgeProps = {
  tone?: IconBadgeTone
  size?: keyof typeof SIZES
  className?: string
  children: React.ReactNode
}

// Fondo de color con un ícono adentro, para las tarjetas y los estados de todo el sitio.
export function IconBadge({ tone = "brand", size = "md", className, children }: IconBadgeProps) {
  return (
    <span className={cn("flex shrink-0 items-center justify-center", TONES[tone], SIZES[size], className)}>
      {children}
    </span>
  )
}
