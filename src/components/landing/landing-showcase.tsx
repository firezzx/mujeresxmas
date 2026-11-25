import Image from "next/image"
import Link from "next/link"

import { BrandCard } from "@/components/account/account-card"
import { ShimmerLink } from "@/components/buttons/shimmer-link"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import {
  ArrowBadge,
  ArrowLink,
  cardClass,
  HEADING_CLASS,
  SampleTag,
  Section,
  SectionHeading,
} from "@/components/landing/landing-ui"
import { BandBackdrop, PAGE_WIDTH_CLASS, PhotoTile } from "@/components/page-band"
import { KieroStoreMockup } from "@/components/landing/kiero-store-mockup"
import { ScreenSection } from "@/components/landing/screen"
import { BlurFade } from "@/components/ui/blur-fade"
import { Marquee } from "@/components/ui/marquee"
import { JOIN_HREF, ROUTES } from "@/config/navigation"
import {
  HOME_COURSES,
  HOME_EVENTS,
  HOME_INSIDE,
  HOME_NOTES,
  HOME_PATHS,
  HOME_PRODUCT,
  HOME_SECTION_IDS,
  HOME_VOICES,
} from "@/content/home"
import { formatDateParts } from "@/lib/format"
import { getShowcase, type ShowcaseCard, type ShowcaseEvent, type ShowcaseVoice } from "@/lib/home-showcase"
import { cn } from "@/lib/utils"

// Vitrina del inicio: lo que hay adentro, con datos reales (y ejemplos solo en desarrollo).

// Los cursos reales todavía no tienen foto: se usan las de los ejemplos para que la tarjeta no quede vacía
const COURSE_FALLBACK_IMAGES = HOME_COURSES.samples.map((sample) => sample.image)

const CARD_GRID_CLASS = "grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-8 md:grid-cols-3"

// Tarjeta de cursos y notas (la de siempre): foto, título, bajada y dato, con el brillo de marca
function ContentCard({ item, icon, index }: { item: ShowcaseCard; icon: IconName; index: number }) {
  return (
    <BlurFade inView delay={index * 0.06} className="h-full min-w-0">
      <IconHoverArea className="h-full">
        <Link
          href={item.href}
          className="group block h-full rounded-xl outline-none transition-transform duration-500 ease-premium hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <BrandCard contentClassName="flex flex-col gap-4 p-3 pb-6 sm:p-4 sm:pb-6">
            <span className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-brand-soft/35">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 29rem, (min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                />
              ) : (
                <IconBadge tone={cycleTone(index)} size="lg">
                  <HoverIcon name={icon} size={24} />
                </IconBadge>
              )}
            </span>
            <span className="flex flex-col gap-2 px-2">
              <span className="font-heading text-xl leading-snug font-semibold tracking-[-0.01em] text-balance [overflow-wrap:anywhere]">
                {item.title}
              </span>
              {item.text && (
                <span className="line-clamp-2 text-base leading-relaxed text-pretty [overflow-wrap:anywhere] text-muted-foreground">
                  {item.text}
                </span>
              )}
              <span className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {item.meta}
                {item.sample && <SampleTag />}
              </span>
            </span>
          </BrandCard>
        </Link>
      </IconHoverArea>
    </BlurFade>
  )
}

// Cómo se reparten las celdas según cuántas secciones tienen contenido
const TILE_LAYOUTS: Record<number, string[]> = {
  1: ["col-span-2 lg:col-span-4"],
  2: ["col-span-2", "col-span-2"],
  3: ["col-span-2 lg:row-span-2", "lg:col-span-2", "lg:col-span-2"],
  4: ["col-span-2 lg:row-span-2", "", "", "col-span-2"],
}

// Lo que hay adentro, en mosaicos con foto que llevan a cada sección. Solo aparece lo que tiene contenido.
function Paths({ available }: { available: (keyof typeof HOME_PATHS)[] }) {
  const layout = TILE_LAYOUTS[available.length]
  return (
    <Section id={HOME_SECTION_IDS.inside}>
      <SectionHeading align="left" title={HOME_INSIDE.title} accent={HOME_INSIDE.titleHighlight} />
      <ul className="grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:gap-4 lg:auto-rows-[17rem] lg:grid-cols-4">
        {available.map((key, index) => (
          <li key={key} className={cn("min-w-0", layout[index])}>
            <PhotoTile {...HOME_PATHS[key]} index={index} href={`#${HOME_SECTION_IDS[key]}`} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Courses({ items }: { items: ShowcaseCard[] }) {
  if (items.length === 0) return null
  return (
    <Section id={HOME_SECTION_IDS.courses}>
      <SectionHeading
        align="left"
        eyebrow="Aprender"
        title={HOME_COURSES.title}
        accent={HOME_COURSES.titleHighlight}
        description={HOME_COURSES.description}
        action={<ArrowLink href={JOIN_HREF}>{HOME_COURSES.cta}</ArrowLink>}
      />
      <div className={CARD_GRID_CLASS}>
        {items.map((item, index) => (
          <ContentCard
            key={item.key}
            item={{ ...item, image: item.image ?? COURSE_FALLBACK_IMAGES[index % COURSE_FALLBACK_IMAGES.length] }}
            icon="graduation-cap"
            index={index}
          />
        ))}
      </div>
      <ul className="mt-10 flex flex-wrap gap-2">
        {HOME_COURSES.topics.map((topic) => (
          <li key={topic} className="rounded-md bg-paper px-3 py-1.5 text-sm">
            {topic}
          </li>
        ))}
      </ul>
    </Section>
  )
}

// Kiero: franja oscura a todo el ancho. A la izquierda, la marca, el beneficio, tres ventajas y
// las acciones; a la derecha, una maqueta de tienda en perspectiva con tarjetas flotando.
function Product() {
  const { home } = HOME_PRODUCT
  return (
    <ScreenSection
      id={HOME_SECTION_IDS.products}
      backdrop={<BandBackdrop tone="green" />}
      innerClassName="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16"
    >
      <BlurFade inView className="flex flex-col">
        <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-brand" />
          {home.eyebrow}
        </p>
        <p className="mt-6 font-heading text-2xl leading-none font-bold tracking-[-0.02em] text-brand-green-strong">
          {HOME_PRODUCT.title}
        </p>
        <h2 className={cn(HEADING_CLASS, "mt-3 text-4xl leading-[1.02] sm:text-5xl xl:text-6xl")}>
          {home.titleStart} <span className="text-brand-green-strong">{home.titleHighlight}</span>
        </h2>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground">{home.description}</p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {home.benefits.map((benefit) => (
            <li key={benefit.title}>
              <IconHoverArea className="flex h-full flex-col gap-3 rounded-xl bg-background/85 p-4 shadow-[0_18px_36px_-24px_rgb(26_26_26/0.35)] ring-1 ring-foreground/[0.06]">
                <IconBadge tone="green" size="sm">
                  <HoverIcon name={benefit.icon} size={17} />
                </IconBadge>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-base font-semibold">{benefit.title}</span>
                  <span className="text-sm leading-snug text-muted-foreground">{benefit.text}</span>
                </div>
              </IconHoverArea>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center">
          <ShimmerLink href={ROUTES.kiero} className="w-full sm:w-auto">
            {HOME_PRODUCT.cta}
          </ShimmerLink>
          <ArrowLink href={ROUTES.membresia} className="justify-center sm:justify-start">
            {home.secondaryCta}
          </ArrowLink>
        </div>
      </BlurFade>

      <KieroStoreMockup />
    </ScreenSection>
  )
}

function Notes({ items }: { items: ShowcaseCard[] }) {
  if (items.length === 0) return null
  return (
    <section
      id={HOME_SECTION_IDS.notes}
      className="relative isolate scroll-mt-0 overflow-hidden lg:flex lg:min-h-svh lg:flex-col"
    >
      <BandBackdrop tone="soft" />
      <div className={cn(PAGE_WIDTH_CLASS, "relative w-full py-20 md:py-28 lg:my-auto lg:pt-24 lg:pb-12")}>
        <SectionHeading
          align="left"
          eyebrow="Leer"
          title={HOME_NOTES.title}
          accent={HOME_NOTES.titleHighlight}
          description={HOME_NOTES.description}
          action={<ArrowLink href={ROUTES.blog}>{HOME_NOTES.cta}</ArrowLink>}
        />
        <div className={CARD_GRID_CLASS}>
          {items.map((item, index) => (
            <ContentCard key={item.key} item={item} icon="file-text" index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const VOICE_TONES = ["pink", "green", "orange", "paper"] as const

function Voices({ items }: { items: ShowcaseVoice[] }) {
  if (items.length === 0) return null
  return (
    <section className="relative py-20 md:py-28 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-24 lg:pb-12">
      <div className={cn(PAGE_WIDTH_CLASS, "w-full")}>
        <SectionHeading eyebrow={HOME_VOICES.kicker} title={HOME_VOICES.title} accent={HOME_VOICES.titleHighlight} />
      </div>
      <div className="relative">
        <Marquee pauseOnHover className="[--duration:50s] [--gap:1rem]">
          {items.map((voice, index) => (
            <figure
              key={voice.name}
              className={cardClass(VOICE_TONES[index % VOICE_TONES.length], "flex w-80 flex-col gap-6 p-7 sm:w-96")}
            >
              <span aria-hidden className="font-heading text-6xl leading-[0.5] font-semibold text-brand">
                “
              </span>
              <blockquote className="font-heading text-xl leading-snug font-medium text-pretty">
                {voice.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span className="relative size-11 overflow-hidden rounded-full">
                  <Image src={voice.image} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <span className="flex flex-col">
                  <span className="font-semibold">{voice.name}</span>
                  <span className="text-sm text-muted-foreground">{voice.detail}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Marquee>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-linear-to-r from-background"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-linear-to-l from-background"
        />
      </div>
    </section>
  )
}

function Events({ items }: { items: ShowcaseEvent[] }) {
  if (items.length === 0) return null
  return (
    <Section fit id={HOME_SECTION_IDS.events}>
      <SectionHeading
        align="left"
        eyebrow="Encontrarnos"
        title={HOME_EVENTS.title}
        accent={HOME_EVENTS.titleHighlight}
      />
      <ul className="grid gap-4 md:grid-cols-3">
        {items.map((event, index) => {
          const { day, month, time } = formatDateParts(event.startsAt)
          const first = index === 0
          return (
            <li key={event.key} className="min-w-0">
              <BlurFade inView delay={index * 0.06} className="h-full">
                <IconHoverArea className="h-full">
                  <Link
                    href={JOIN_HREF}
                    className={cardClass(
                      first ? "green" : "white",
                      "group flex h-full flex-col gap-8 p-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col items-center rounded-lg bg-background px-4 py-2.5 shadow-[0_6px_16px_-10px_rgb(26_26_26/0.3)]">
                        <span className="font-heading text-3xl leading-none font-semibold">{day}</span>
                        <span className="text-xs font-semibold tracking-wide text-brand uppercase">{month}</span>
                      </div>
                      {first ? (
                        <span className="rounded-md bg-background px-2.5 py-1 text-xs font-semibold">
                          {HOME_EVENTS.nextLabel}
                        </span>
                      ) : (
                        event.sample && <SampleTag />
                      )}
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <h3 className={cn(HEADING_CLASS, "text-xl")}>{event.title}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <HoverIcon name="calendar-days" size={14} />
                          {time} h{event.meta && ` · ${event.meta}`}
                        </div>
                      </div>
                      <ArrowBadge />
                    </div>
                  </Link>
                </IconHoverArea>
              </BlurFade>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}

export async function LandingShowcase() {
  const { courses, notes, events, voices } = await getShowcase()
  const available: (keyof typeof HOME_PATHS)[] = []
  if (courses.length) available.push("courses")
  if (notes.length) available.push("notes")
  available.push("products")
  if (events.length) available.push("events")
  return (
    <>
      <Paths available={available} />
      <Courses items={courses} />
      <Product />
      <Notes items={notes} />
      <Voices items={voices} />
      <Events items={events} />
    </>
  )
}

export function LandingShowcaseSkeleton() {
  return (
    <div className={cn(PAGE_WIDTH_CLASS, "grid gap-4 py-20 md:grid-cols-3 md:py-28")}>
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} aria-hidden className="aspect-[4/5] animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  )
}
