import { BrandHighlight, Eyebrow } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  titleStart: string
  titleHighlight: string
  description?: string
  align?: "center" | "left"
}

// Encabezado de las secciones de la home: etiqueta, título con la parte final destacada y bajada.
export function SectionHeading({
  eyebrow,
  titleStart,
  titleHighlight,
  description,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center"
  return (
    <div className={cn("flex flex-col gap-4", centered ? "items-center text-center" : "items-start")}>
      <BlurFade inView>
        <Eyebrow>{eyebrow}</Eyebrow>
      </BlurFade>
      <BlurFade inView delay={0.05}>
        <h2 className="max-w-2xl font-heading text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
          {titleStart} <BrandHighlight>{titleHighlight}</BrandHighlight>
        </h2>
      </BlurFade>
      {description && (
        <BlurFade inView delay={0.1}>
          <p className="max-w-xl text-[15px] leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {description}
          </p>
        </BlurFade>
      )}
    </div>
  )
}
