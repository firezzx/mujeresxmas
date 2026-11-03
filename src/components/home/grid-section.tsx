import { cn } from "@/lib/utils"

const CROSS_CLASS =
  "absolute -top-[7px] z-10 size-[13px] before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-foreground/35 after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-foreground/35"

type GridSectionProps = {
  id?: string
  // Sin línea ni cruces arriba, para la primera sección de la página
  first?: boolean
  // Con línea abajo, para la última sección de la página
  last?: boolean
  className?: string
  children: React.ReactNode
}

// Sección de la retícula: líneas finas a los costados del contenido, una línea de borde a borde
// arriba y una cruz en cada encuentro. Apiladas forman el marco de toda la página.
export function GridSection({ id, first, last, className, children }: GridSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 border-border px-3 sm:px-6", !first && "border-t", last && "border-b")}
    >
      <div className={cn("relative mx-auto max-w-content-inner border-x border-border", className)}>
        {!first && (
          <>
            <span aria-hidden className={cn(CROSS_CLASS, "-left-[7px]")} />
            <span aria-hidden className={cn(CROSS_CLASS, "-right-[7px]")} />
          </>
        )}
        {children}
      </div>
    </section>
  )
}

// Grilla de celdas separadas por líneas: las líneas son el espacio entre celdas, así que se
// acomodan solas en cualquier cantidad de columnas. Cada celda necesita fondo propio.
export const GRID_CELLS_CLASS = "grid gap-px bg-border"
