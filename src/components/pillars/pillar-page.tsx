import Image from "next/image"

import { BrandCard } from "@/components/account/account-card"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { RegisterCta } from "@/components/cta/register-cta"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { Band, ColorHero, PHOTO_FRAME_CLASS, PhotoTile } from "@/components/page-band"
import { BrandHighlight, Eyebrow } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import {
  ACCESS_LABELS,
  PILLAR_CLOSING,
  PILLAR_LIST,
  type Access,
  type Pillar,
  type PillarItem,
} from "@/content/pilares"
import { cn } from "@/lib/utils"

const SECTION_TITLE_CLASS =
  "font-heading text-[2rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-5xl"

const ACCESS_CLASS: Record<Access, string> = {
  free: "bg-brand-green/18 text-brand-green-strong",
  member: "bg-brand-soft/45 text-foreground",
}

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

function ItemCard({ item, index, compact = false }: { item: PillarItem; index: number; compact?: boolean }) {
  return (
    <BlurFade inView delay={(index % 3) * 0.06} className="h-full">
      <IconHoverArea className="h-full">
        <BrandCard contentClassName={cn("flex flex-col gap-4", compact ? "p-5 sm:p-6" : "p-6 sm:p-7")}>
          <div className="flex items-start justify-between gap-3">
            <IconBadge tone={cycleTone(index)} size={compact ? "md" : "lg"}>
              <HoverIcon name={item.icon} size={compact ? 22 : 24} />
            </IconBadge>
            <AccessTag access={item.access} />
          </div>
          <h3
            className={cn(
              "font-heading font-semibold tracking-[-0.01em] text-balance",
              compact ? "text-xl" : "text-2xl"
            )}
          >
            {item.title}
          </h3>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground">{item.text}</p>
        </BrandCard>
      </IconHoverArea>
    </BlurFade>
  )
}

function SectionHead({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
      <div className="flex flex-col gap-4">
        <BlurFade inView>
          <Eyebrow>{eyebrow}</Eyebrow>
        </BlurFade>
        <BlurFade inView delay={0.06}>
          <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
        </BlurFade>
      </div>
      <BlurFade inView delay={0.12} className="md:max-w-sm">
        <p className="text-base leading-relaxed text-pretty sm:text-lg">{description}</p>
      </BlurFade>
    </div>
  )
}

// Página de un pilar: encabezado con foto, servicios con su acceso, un bloque extra opcional,
// cierre con los planes y links a los otros dos pilares.
export function PillarPage({ pillar }: { pillar: Pillar }) {
  const others = PILLAR_LIST.filter((other) => other.slug !== pillar.slug)
  return (
    <main className="relative flex flex-1 flex-col">
      <ColorHero
        tone={pillar.heroTone}
        eyebrow={`Pilar ${pillar.name}`}
        title={
          <>
            {pillar.hero.titleStart} <BrandHighlight>{pillar.hero.titleHighlight}</BrandHighlight>
          </>
        }
        description={pillar.hero.description}
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <RegisterCta className="w-full sm:w-auto" />
            <HoverRevealLink href={ROUTES.planes} className="w-full sm:w-auto">
              {PILLAR_CLOSING.plansCta}
            </HoverRevealLink>
          </div>
        }
        aside={
          <div className="relative mt-4 mr-2 lg:mt-0">
            <div aria-hidden className="absolute -top-4 -right-3 h-3/5 w-2/5 rotate-6 rounded-xl bg-background/60" />
            <div className={cn(PHOTO_FRAME_CLASS, "aspect-[4/3] -rotate-1")}>
              <Image
                src={pillar.image}
                alt={pillar.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <span className="absolute -bottom-4 left-5 z-10 flex items-center gap-2.5 rounded-lg bg-background py-1.5 pr-4 pl-1.5 font-hand text-2xl leading-none font-semibold shadow-[0_12px_28px_-10px_rgb(26_26_26/0.4)]">
              <IconBadge tone={pillar.badgeTone} size="sm">
                <HoverIcon name={pillar.icon} size={16} />
              </IconBadge>
              {pillar.tag}
            </span>
          </div>
        }
      />

      <Band>
        <SectionHead
          eyebrow={`Pilar ${pillar.name}`}
          title={pillar.services.title}
          description={pillar.services.description}
        />
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pillar.services.items.map((item, index) => (
            <li key={item.title} className="min-w-0">
              <ItemCard item={item} index={index} />
            </li>
          ))}
        </ul>
      </Band>

      {pillar.extra && (
        <Band tone="soft">
          <SectionHead
            eyebrow={pillar.extra.eyebrow}
            title={pillar.extra.title}
            description={pillar.extra.description}
          />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillar.extra.items.map((item, index) => (
              <li key={item.title} className="min-w-0">
                <ItemCard item={item} index={index + 1} compact />
              </li>
            ))}
          </ul>
        </Band>
      )}

      <Band image={pillar.image}>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <BlurFade inView>
            <p className="font-hand text-3xl leading-none font-semibold text-brand-soft sm:text-4xl">
              {PILLAR_CLOSING.hand}
            </p>
          </BlurFade>
          <BlurFade inView delay={0.06}>
            <h2 className={SECTION_TITLE_CLASS}>
              {PILLAR_CLOSING.title} <BrandHighlight>{PILLAR_CLOSING.titleHighlight}</BrandHighlight>
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.1}>
            <p className="text-base leading-relaxed text-pretty sm:text-lg">{PILLAR_CLOSING.description}</p>
          </BlurFade>
          <BlurFade inView delay={0.14} className="mt-3 w-full">
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <RegisterCta className="w-full sm:w-auto" />
              <HoverRevealLink href={ROUTES.planes} className="w-full sm:w-auto">
                {PILLAR_CLOSING.plansCta}
              </HoverRevealLink>
            </div>
          </BlurFade>
        </div>
      </Band>

      <Band tone={pillar.extra ? "white" : "soft"}>
        <div>
          <BlurFade inView>
            <h2 className="mb-6 font-heading text-2xl font-semibold tracking-[-0.01em]">
              {PILLAR_CLOSING.othersTitle}
            </h2>
          </BlurFade>
          <ul className="grid auto-rows-[14rem] grid-cols-1 gap-4 sm:auto-rows-[16rem] md:grid-cols-2">
            {others.map((other, index) => (
              <li key={other.slug} className="min-w-0">
                <PhotoTile
                  image={other.image}
                  icon={other.icon}
                  index={index}
                  title={other.name}
                  text={other.summary}
                  href={other.href}
                />
              </li>
            ))}
          </ul>
        </div>
      </Band>
    </main>
  )
}
