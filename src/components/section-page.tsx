import { RegisterCta } from "@/components/cta/register-cta"
import { ColorHero } from "@/components/page-band"

// Página de una sección del menú. Por ahora solo el encabezado: el contenido se suma debajo cuando esté.
export function SectionPage({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <main className="relative flex flex-1 flex-col">
      <ColorHero image={image} title={title} description={description} actions={<RegisterCta />} />
    </main>
  )
}
