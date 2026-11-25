import Image from "next/image"

import { blogImageUrl } from "@/lib/blog-shared"
import { cn } from "@/lib/utils"

// Portada del blog que se ve completa con cualquier formato (banners muy anchos, fotos 16:9 o
// cuadradas): la imagen va entera en el centro y detrás, la misma imagen ampliada y difuminada
// rellena el recuadro con sus propios colores. El tamaño del recuadro lo define className.
export function BlogCover({
  path,
  alt,
  sizes,
  priority,
  zoomOnHover,
  className,
}: {
  path: string
  alt: string | null
  sizes: string
  priority?: boolean
  zoomOnHover?: boolean
  className?: string
}) {
  const src = blogImageUrl(path)
  return (
    <span className={cn("relative isolate block overflow-hidden bg-foreground/[0.04]", className)}>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        priority={priority}
        className="-z-10 scale-125 object-cover opacity-70 blur-2xl saturate-150"
      />
      <span aria-hidden className="absolute inset-0 -z-10 bg-background/25" />
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-contain drop-shadow-[0_10px_24px_rgb(26_26_26/0.18)]",
          zoomOnHover && "transition-transform duration-700 ease-premium group-hover:scale-[1.03]"
        )}
      />
    </span>
  )
}
