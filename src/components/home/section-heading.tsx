import { Eyebrow } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { TextAnimate } from "@/components/ui/text-animate"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: "center" | "left"
}

const TITLE_CLASS =
  "max-w-2xl font-heading text-[2rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-5xl"

// Encabezado de las secciones de la home: etiqueta, título con Text Animate y bajada.
export function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  const centered = align === "center"
  return (
    <div className={cn("flex flex-col gap-4", centered ? "items-center text-center" : "items-start")}>
      <BlurFade inView>
        <Eyebrow>{eyebrow}</Eyebrow>
      </BlurFade>
      {/* Text Animate deja el espacio entre palabras al principio de cada renglón: alineado a la
          izquierda se nota, así que ese título entra completo con Blur Fade */}
      {centered ? (
        <TextAnimate as="h2" animation="blurInUp" by="word" once duration={0.5} className={TITLE_CLASS}>
          {title}
        </TextAnimate>
      ) : (
        <BlurFade inView delay={0.05}>
          <h2 className={TITLE_CLASS}>{title}</h2>
        </BlurFade>
      )}
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
