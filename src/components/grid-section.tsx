import { cn } from "@/lib/utils"

const CROSS_CLASS =
  "absolute z-10 size-[13px] animate-grid-cross before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-foreground/35 after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-foreground/35"

// Cruces en los dos encuentros de una línea horizontal con los costados del marco, subiendo y
// bajando por las líneas verticales. Van dentro del elemento con los bordes laterales. El desfase
// es negativo para que arranquen ya en movimiento; la de la derecha va un poco corrida.
export function GridCrosses({ side = "top" }: { side?: "top" | "bottom" }) {
  const position = side === "top" ? "-top-[7px]" : "-bottom-[7px]"
  return (
    <>
      <span
        aria-hidden
        style={{ animationDelay: "var(--cross-delay, 0s)" }}
        className={cn(CROSS_CLASS, position, "-left-[7px]")}
      />
      <span
        aria-hidden
        style={{ animationDelay: "calc(var(--cross-delay, 0s) - 1.2s)" }}
        className={cn(CROSS_CLASS, position, "-right-[7px]")}
      />
    </>
  )
}

type GridSectionProps = {
  id?: string
  // Sin línea ni cruces arriba, para la primera sección de la página
  first?: boolean
  className?: string
  children: React.ReactNode
}

// Sección de la retícula: líneas finas a los costados del contenido, una línea de borde a borde
// arriba y una cruz en cada encuentro. Apiladas forman el marco de toda la página.
export function GridSection({ id, first, className, children }: GridSectionProps) {
  return (
    <section
      id={id}
      // Cada sección desfasa sus cruces, para que no se muevan todas juntas
      className={cn(
        "scroll-mt-20 border-border px-3 nth-of-type-[3n]:[--cross-delay:-6s] nth-of-type-[3n+2]:[--cross-delay:-3s] sm:px-6",
        !first && "border-t"
      )}
    >
      <div className={cn("relative mx-auto max-w-content-inner border-x border-border", className)}>
        {!first && <GridCrosses />}
        {children}
      </div>
    </section>
  )
}

// Resplandor naranja de la marca que sube desde abajo del título, para el hero de cada página.
export function HeroGlow() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,color-mix(in_oklab,var(--brand)_24%,transparent),transparent)]"
    />
  )
}

// Grilla de celdas separadas por líneas: las líneas son el espacio entre celdas, así que se
// acomodan solas en cualquier cantidad de columnas. Cada celda necesita fondo propio.
export const GRID_CELLS_CLASS = "grid gap-px bg-border"
