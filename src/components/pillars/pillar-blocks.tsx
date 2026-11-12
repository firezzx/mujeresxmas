import Image from "next/image"
import Link from "next/link"

import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { ArrowBadge, ArrowLink, cardClass, HEADING_CLASS, Pill, type CardTone } from "@/components/landing/landing-ui"
import { ScreenSection } from "@/components/landing/screen"
import { BandBackdrop } from "@/components/page-band"
import { BlurFade } from "@/components/ui/blur-fade"
import { ACCESS_LABELS, PILLARS_PAGE, type Access, type Pillar, type PillarItem } from "@/content/pilares"
import { cn } from "@/lib/utils"

// Piezas de los pilares que comparten la página general y la de cada pilar.

const ACCESS_CLASS: Record<Access, string> = {
  free: "bg-brand-green/18 text-brand-green-strong",
  member: "bg-brand-soft/45 text-foreground",
}

// Etiqueta de acceso de cada servicio: gratis o con membresía
export function AccessTag({ access }: { access: Access }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
        ACCESS_CLASS[access]
      )}
    >
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", access === "free" ? "bg-brand-green-strong" : "bg-brand")}
      />
      {ACCESS_LABELS[access]}
    </span>
  )
}

const SERVICE_TONES: CardTone[] = ["green", "pink", "orange", "paper"]

function ServiceCard({ item, index, wide }: { item: PillarItem; index: number; wide?: boolean }) {
  return (
    <BlurFade inView delay={(index % 4) * 0.06} className="h-full">
      <IconHoverArea
        className={cardClass(
          SERVICE_TONES[index % SERVICE_TONES.length],
          cn(
            "flex h-full gap-4 p-6 transition-transform duration-500 ease-premium hover:-translate-y-1 lg:gap-3 lg:p-5",
            wide ? "flex-col sm:flex-row sm:items-start" : "flex-col"
          )
        )}
      >
        <IconBadge tone={cycleTone(index)}>
          <HoverIcon name={item.icon} size={22} />
        </IconBadge>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className={cn(HEADING_CLASS, "text-xl")}>{item.title}</h3>
          <p className="text-[15px] leading-relaxed text-pretty">{item.text}</p>
          <div className="mt-auto pt-1.5">
            <AccessTag access={item.access} />
          </div>
        </div>
      </IconHoverArea>
    </BlurFade>
  )
}

// Grilla de servicios en tarjetas de color. Con cinco, en escritorio van dos arriba y tres abajo.
// `full` es para cuando la grilla ocupa todo el ancho (sin foto al costado): con cuatro van en fila.
export function ServiceGrid({ items, full = false }: { items: PillarItem[]; full?: boolean }) {
  const odd = items.length % 2 === 1
  const five = items.length === 5
  return (
    <ul
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        five && "lg:grid-cols-6",
        full && items.length === 4 && "lg:grid-cols-4",
        full && items.length === 3 && "lg:grid-cols-3"
      )}
    >
      {items.map((item, index) => (
        <li
          key={item.title}
          className={cn(
            "min-w-0",
            odd && index === 0 && "sm:col-span-2",
            five && (index < 2 ? "lg:col-span-3" : "lg:col-span-2"),
            full && items.length === 3 && "lg:col-span-1"
          )}
        >
          <ServiceCard item={item} index={index} wide={odd && index === 0 && !five && !full} />
        </li>
      ))}
    </ul>
  )
}

// Rótulo manuscrito del pilar sobre su foto
export function PillarTag({ pillar, className }: { pillar: Pillar; className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5 rounded-lg bg-background py-1.5 pr-4 pl-1.5 font-hand text-2xl leading-none font-semibold text-foreground",
        className
      )}
    >
      <IconBadge tone={pillar.badgeTone} size="sm">
        <HoverIcon name={pillar.icon} size={16} />
      </IconBadge>
      {pillar.tag}
    </span>
  )
}

// Foto del pilar que lleva a su página (o a su sección): rótulo, nombre y flecha sobre un velo
export function PillarCard({
  pillar,
  href = pillar.href,
  priority,
  summary,
  className,
}: {
  pillar: Pillar
  href?: string
  priority?: boolean
  summary?: boolean
  className?: string
}) {
  const anchor = href.startsWith("#")
  const content = (
    <>
      <Image
        src={pillar.image}
        alt={pillar.imageAlt}
        fill
        priority={priority}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="-z-20 object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-primary/85 via-primary/30 to-transparent"
      />
      <span className="surface-light mb-auto w-fit rounded-lg bg-background">
        <IconBadge tone={pillar.badgeTone}>
          <HoverIcon name={pillar.icon} size={22} />
        </IconBadge>
      </span>
      <div className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-hand text-2xl leading-none font-semibold text-brand-soft">{pillar.tag}</span>
          <span className={cn(HEADING_CLASS, "text-3xl lg:text-4xl")}>{pillar.name}</span>
          {summary && <span className="mt-1 max-w-md text-[15px] leading-relaxed text-white/85">{pillar.summary}</span>}
        </div>
        <ArrowBadge />
      </div>
    </>
  )
  const linkClass = cn(
    "group relative isolate flex h-80 flex-col justify-end overflow-hidden rounded-xl p-5 text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/40 lg:h-full lg:p-6",
    className
  )
  return (
    <IconHoverArea className="h-full">
      {anchor ? (
        <a href={href} className={linkClass}>
          {content}
        </a>
      ) : (
        <Link href={href} className={linkClass}>
          {content}
        </Link>
      )}
    </IconHoverArea>
  )
}

// La Academia de Desarrollo: franja verde propia, con el texto a un lado y los cursos en tarjetas
export function Academy({ pillar, showLink = true }: { pillar: Pillar; showLink?: boolean }) {
  if (!pillar.extra) return null
  return (
    <ScreenSection backdrop={<BandBackdrop tone="green" />}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <BlurFade inView className="flex flex-col items-start gap-5">
          <Pill className="bg-background">{PILLARS_PAGE.academyLabel}</Pill>
          <h2 className={cn(HEADING_CLASS, "text-4xl leading-[1.02] sm:text-6xl")}>{pillar.extra.title}</h2>
          <p className="max-w-lg text-lg leading-relaxed text-pretty">{pillar.extra.description}</p>
          {showLink && (
            <ArrowLink href={pillar.href} className="mt-2">
              {PILLARS_PAGE.moreLabel} {pillar.name}
            </ArrowLink>
          )}
        </BlurFade>
        <ul className="grid gap-3 sm:grid-cols-2">
          {pillar.extra.items.map((item, index) => (
            <li key={item.title} className="min-w-0">
              <BlurFade inView delay={(index % 6) * 0.05} className="h-full">
                <IconHoverArea
                  className={cardClass(
                    "white",
                    "flex h-full items-center gap-3.5 p-4 transition-transform duration-500 ease-premium hover:-translate-y-1"
                  )}
                >
                  <IconBadge tone={cycleTone(index)}>
                    <HoverIcon name={item.icon} size={22} />
                  </IconBadge>
                  <div className="flex min-w-0 flex-col items-start gap-1.5">
                    <span className="font-heading text-base leading-tight font-semibold">{item.title}</span>
                    <AccessTag access={item.access} />
                  </div>
                </IconHoverArea>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </ScreenSection>
  )
}
