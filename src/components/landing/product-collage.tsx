import Image from "next/image"

import { HoverIcon } from "@/components/icons/hover-icon"
import { HOME_PRODUCT } from "@/content/home"
import { cn } from "@/lib/utils"

// Composición de Kiero: dos fotos superpuestas y una tarjeta flotante con el camino de vender por
// redes a tener tu tienda. `ringClass` es el borde de la foto chica, del color del fondo.
export function ProductCollage({ ringClass = "ring-primary", priority }: { ringClass?: string; priority?: boolean }) {
  return (
    <div className="relative mx-auto aspect-[1/1.02] w-full max-w-xl">
      {/* Foto principal */}
      <div className="absolute top-0 right-0 h-[80%] w-[74%] overflow-hidden rounded-xl shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]">
        <Image
          src={HOME_PRODUCT.image}
          alt={HOME_PRODUCT.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 34vw, 74vw"
          className="object-cover"
        />
      </div>
      {/* Foto chica, encastrada abajo a la izquierda */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[46%] w-[44%] overflow-hidden rounded-xl shadow-[0_24px_48px_-20px_rgb(0_0_0/0.8)] ring-[6px]",
          ringClass
        )}
      >
        <Image
          src={HOME_PRODUCT.secondImage}
          alt={HOME_PRODUCT.secondImageAlt}
          fill
          priority={priority}
          sizes="(min-width: 768px) 20vw, 44vw"
          className="object-cover"
        />
      </div>
      {/* Tarjeta flotante: el camino de vender por redes a tener tu tienda */}
      <div className="surface-light absolute bottom-[6%] left-[38%] w-[58%] max-w-72 rounded-xl bg-background p-4 text-foreground shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)] sm:p-5">
        <p className="font-hand text-2xl leading-none font-semibold text-brand-green-strong">{HOME_PRODUCT.chip}</p>
        <ol className="mt-3 flex flex-col gap-2.5">
          {HOME_PRODUCT.steps.map((step, index) => {
            const last = index === HOME_PRODUCT.steps.length - 1
            return (
              <li key={step} className="flex items-center gap-2.5 text-sm font-medium">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md",
                    last ? "bg-brand text-brand-foreground" : "bg-brand-green/18 text-brand-green-strong"
                  )}
                >
                  {last ? <HoverIcon name="arrow-right" size={14} /> : <HoverIcon name="check" size={14} />}
                </span>
                {step}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
