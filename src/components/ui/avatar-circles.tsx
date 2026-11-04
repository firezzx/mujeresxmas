import Image from "next/image"

import { cn } from "@/lib/utils"

// Avatar Circles de Magic UI, adaptado: fotos optimizadas y sin links ni contador, porque acá solo
// acompañan al texto de al lado.
export function AvatarCircles({ images, className }: { images: string[]; className?: string }) {
  return (
    <div aria-hidden className={cn("flex -space-x-3", className)}>
      {images.map((image) => (
        <Image
          key={image}
          src={image}
          alt=""
          width={44}
          height={44}
          className="size-11 rounded-full border-2 border-background object-cover"
        />
      ))}
    </div>
  )
}
