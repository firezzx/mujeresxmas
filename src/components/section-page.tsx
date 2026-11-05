import Image from "next/image"

import { RegisterCta } from "@/components/cta/register-cta"
import { ColorHero, PHOTO_FRAME_CLASS } from "@/components/page-band"
import { cn } from "@/lib/utils"

// Página de una sección del menú. Por ahora solo el encabezado: el contenido se suma debajo cuando esté.
export function SectionPage({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <main className="relative flex flex-1 flex-col">
      <ColorHero
        title={title}
        description={description}
        actions={<RegisterCta />}
        aside={
          <div className={cn(PHOTO_FRAME_CLASS, "aspect-[4/3] -rotate-1")}>
            <Image src={image} alt="" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        }
      />
    </main>
  )
}
