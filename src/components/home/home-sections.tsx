import Image from "next/image"
import Link from "next/link"
import { cache } from "react"

import { BrandCard } from "@/components/account/account-card"
import { LogoSeal } from "@/components/brand/logo"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { RegisterCta } from "@/components/cta/register-cta"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import {
  Band,
  BandBackdrop,
  PAGE_WIDTH_CLASS,
  PHOTO_FRAME_CLASS,
  PhotoDuo,
  PhotoTile,
  SectionTitle,
} from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { BlurFade } from "@/components/ui/blur-fade"
import { LightRays } from "@/components/ui/light-rays"
import { Particles } from "@/components/ui/particles"
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"
import { TextReveal } from "@/components/ui/text-reveal"
import { BRAND_HEX } from "@/config/brand-effects"
import { ROUTES } from "@/config/navigation"
import {
  HOME_AVATARS,
  HOME_CLOSING,
  HOME_CLOSING_CTA_ID,
  HOME_COURSES,
  HOME_EVENTS,
  HOME_HERO,
  HOME_INSIDE,
  HOME_NOTES,
  HOME_PATHS,
  HOME_PRODUCT,
  HOME_SECTION_IDS,
  HOME_STATEMENT,
  HOME_VOICES,
  SHOW_SAMPLES,
} from "@/content/home"
import { listPublicPosts } from "@/lib/blog"
import { blogImageUrl } from "@/lib/blog-shared"
import { listPublishedCourses, listUpcomingEvents } from "@/lib/content"
import { formatDateParts, formatDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"

const CARDS_PER_SECTION = 3
const VOICES_SHOWN = 3
const CARD_GRID_CLASS = "grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-12 md:grid-cols-3"

function SampleTag() {
  return <span className="text-[13px] font-medium text-muted-foreground">Ejemplo</span>
}

// ─── Cintas con palabras clave ───────────────────────────────────────────────────────────

// Dos cintas cruzadas con palabras en movimiento, que aceleran al bajar (Scroll Based Velocity de Magic UI)
function RibbonWords({ words, dotClass }: { words: string[]; dotClass: string }) {
  return (
    <span className="flex items-center">
      {[...words, ...words].map((word, index) => (
        <span key={index} className="flex items-center">
          <span className="px-5 font-heading text-2xl font-semibold tracking-[-0.01em] sm:px-8 sm:text-4xl">
            {word}
          </span>
          <span aria-hidden className={cn("size-2.5 rounded-full sm:size-3", dotClass)} />
        </span>
      ))}
    </span>
  )
}

export function HomeRibbons() {
  return (
    <div aria-hidden className="relative z-10 -mt-16 h-36 overflow-x-clip sm:-mt-20 sm:h-48">
      <ScrollVelocityContainer className="absolute inset-0">
        <div className="absolute top-1/2 -left-[5%] w-[110%] -translate-y-1/2 rotate-2 bg-brand-green py-2.5 sm:py-3.5">
          <ScrollVelocityRow baseVelocity={2} direction={-1}>
            <RibbonWords words={HOME_HERO.ribbonBottom} dotClass="bg-background" />
          </ScrollVelocityRow>
        </div>
        <div className="absolute top-1/2 -left-[5%] w-[110%] -translate-y-1/2 -rotate-2 bg-foreground py-2.5 text-background shadow-[0_18px_36px_-16px_rgb(26_26_26/0.6)] sm:py-3.5">
          <ScrollVelocityRow baseVelocity={2}>
            <RibbonWords words={HOME_HERO.ribbonTop} dotClass="bg-brand" />
          </ScrollVelocityRow>
        </div>
      </ScrollVelocityContainer>
    </div>
  )
}

// ─── Primera pantalla ────────────────────────────────────────────────────────────────────

const CHIP_POSITIONS = [
  "-left-2 top-[12%] sm:-left-5",
  "-right-2 top-[44%] sm:-right-4",
  "bottom-[24%] -left-2 sm:-left-5",
]

export function HomeHero({ ctaId }: { ctaId: string }) {
  const [first, second, third] = HOME_HERO.photos
  return (
    <Band
      tone="green"
      zigzag
      className="grid items-center gap-12 pt-28 pb-24 md:pt-36 md:pb-36 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16"
    >
      <div className="flex flex-col items-start gap-6">
        <BlurFade inView>
          <h1 className="relative font-heading text-[2.5rem] leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-6xl lg:text-[3.25rem] xl:text-[3.5rem] 2xl:text-[4.25rem]">
            {HOME_HERO.titleStart} <BrandHighlight>{HOME_HERO.titleHighlight}</BrandHighlight>
          </h1>
        </BlurFade>
        <BlurFade inView delay={0.08}>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-foreground/80 sm:text-xl">
            {HOME_HERO.description}
          </p>
        </BlurFade>
        <BlurFade inView delay={0.16} className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row">
            <RegisterCta id={ctaId} className="w-full sm:w-auto" />
            <HoverRevealLink href={`#${HOME_SECTION_IDS.inside}`} className="w-full sm:w-auto">
              {HOME_HERO.secondaryCta}
            </HoverRevealLink>
          </div>
        </BlurFade>
        <BlurFade inView delay={0.24}>
          <div className="flex items-center gap-3">
            <AvatarCircles images={HOME_AVATARS} />
            <span className="font-heading text-lg font-medium">{HOME_HERO.avatarsText}</span>
          </div>
        </BlurFade>
      </div>

      <BlurFade inView delay={0.1} className="relative">
        {/* Collage de fotos sobre dos bloques de color */}
        <div
          aria-hidden
          className="absolute -top-5 -left-4 h-3/5 w-1/2 -rotate-6 rounded-xl bg-brand-soft sm:-left-7"
        />
        <div
          aria-hidden
          className="absolute -right-3 -bottom-5 h-2/5 w-2/5 rotate-6 rounded-xl bg-foreground sm:-right-6"
        />
        <div className="relative grid grid-cols-5 grid-rows-2 gap-3 sm:gap-4">
          <div className={cn(PHOTO_FRAME_CLASS, "col-span-3 row-span-2 aspect-[4/5] -rotate-1")}>
            <Image
              src={first.src}
              alt={first.alt}
              fill
              priority
              sizes="(min-width: 1024px) 28vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className={cn(PHOTO_FRAME_CLASS, "col-span-2 rotate-2")}>
            <Image
              src={second.src}
              alt={second.alt}
              fill
              priority
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className={cn(PHOTO_FRAME_CLASS, "col-span-2 -rotate-1")}>
            <Image
              src={third.src}
              alt={third.alt}
              fill
              priority
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
        {HOME_HERO.chips.map((chip, index) => (
          <span
            key={chip}
            className={cn(
              "absolute z-10 flex items-center gap-2 rounded-lg bg-background px-3 py-1.5 font-hand text-xl leading-none font-semibold whitespace-nowrap shadow-[0_12px_28px_-10px_rgb(26_26_26/0.4)] sm:text-2xl",
              CHIP_POSITIONS[index]
            )}
          >
            <span
              aria-hidden
              className={cn("size-2 rounded-full", ["bg-brand", "bg-brand-green", "bg-brand-soft"][index])}
            />
            {chip}
          </span>
        ))}
        {/* Sello oficial: blanco sobre negro y fijo, como pide el manual */}
        <div className="absolute -bottom-9 left-1/2 z-20 size-28 -translate-x-1/2 rounded-full bg-foreground p-1.5 text-background shadow-[0_16px_32px_-12px_rgb(26_26_26/0.6)] sm:size-36">
          <LogoSeal className="size-full" />
        </div>
      </BlurFade>
    </Band>
  )
}

// ─── Lo que hay adentro ──────────────────────────────────────────────────────────────────

// Datos reales de cada sección, completados con los ejemplos solo donde están habilitados
const withSamples = <T,>(real: T[], samples: T[]) =>
  (SHOW_SAMPLES ? [...real, ...samples] : real).slice(0, CARDS_PER_SECTION)

type ShowcaseCard = {
  key: string
  title: string
  text: string | null
  meta: string
  image: string | null
  imageAlt: string
  href: string
  sample: boolean
}

const getShowcase = cache(async () => {
  const [courses, listing, events] = await Promise.all([
    listPublishedCourses(CARDS_PER_SECTION),
    listPublicPosts(null, 1),
    listUpcomingEvents(CARDS_PER_SECTION),
  ])
  const posts = listing ? [...(listing.featured ? [listing.featured] : []), ...listing.posts] : []

  return {
    courses: withSamples<ShowcaseCard>(
      courses.map((course) => ({
        key: course.id,
        title: course.title,
        text: course.summary,
        meta: course.startsAt ? `Empieza ${formatDateTime(course.startsAt)}` : "Curso online",
        image: null,
        imageAlt: "",
        href: ROUTES.registro,
        sample: false,
      })),
      HOME_COURSES.samples.map((item) => ({
        ...item,
        key: item.title,
        imageAlt: "",
        href: ROUTES.registro,
        sample: true,
      }))
    ),
    notes: withSamples<ShowcaseCard>(
      posts.map((post) => ({
        key: post.id,
        title: post.title,
        text: post.excerpt,
        meta: `${post.readingMinutes} min de lectura`,
        image: post.coverPath && blogImageUrl(post.coverPath),
        imageAlt: post.coverAlt ?? "",
        href: `${ROUTES.blog}/${post.slug}`,
        sample: false,
      })),
      HOME_NOTES.samples.map((item) => ({ ...item, key: item.title, imageAlt: "", href: ROUTES.blog, sample: true }))
    ),
    events: withSamples(
      events.map((event) => ({
        key: event.id,
        title: event.title,
        meta: [event.location, event.onlineUrl && "Online"].filter(Boolean).join(" · "),
        startsAt: event.startsAt,
        sample: false,
      })),
      HOME_EVENTS.samples.map((item) => ({ ...item, key: item.title, sample: true }))
    ),
    voices: SHOW_SAMPLES ? HOME_VOICES.samples.slice(0, VOICES_SHOWN) : [],
  }
})

function ContentCard({ card, icon, index }: { card: ShowcaseCard; icon: IconName; index: number }) {
  return (
    <BlurFade inView delay={index * 0.06} className="h-full min-w-0">
      <IconHoverArea className="h-full">
        <Link
          href={card.href}
          className="group block h-full rounded-xl outline-none transition-transform duration-500 ease-premium hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <BrandCard contentClassName="flex flex-col gap-4 p-3 pb-6 sm:p-4 sm:pb-6">
            <span className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-brand-soft/35">
              {card.image ? (
                <Image
                  src={card.image}
                  alt={card.imageAlt}
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
                {card.title}
              </span>
              {card.text && (
                <span className="line-clamp-2 text-base leading-relaxed text-pretty [overflow-wrap:anywhere] text-muted-foreground">
                  {card.text}
                </span>
              )}
              <span className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {card.meta}
                {card.sample && <SampleTag />}
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

// Lo que hay en el sitio, en mosaicos con foto. Solo aparece lo de las secciones con contenido.
function HomePaths({ available }: { available: (keyof typeof HOME_PATHS)[] }) {
  const layout = TILE_LAYOUTS[available.length]
  return (
    <Band id={HOME_SECTION_IDS.inside}>
      <SectionTitle title={`${HOME_INSIDE.title} ${HOME_INSIDE.titleHighlight}`} />
      <ul className="grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:gap-4 lg:auto-rows-[17rem] lg:grid-cols-4">
        {available.map((key, index) => (
          <li key={key} className={cn("min-w-0", layout[index])}>
            <PhotoTile {...HOME_PATHS[key]} index={index} href={`#${HOME_SECTION_IDS[key]}`} />
          </li>
        ))}
      </ul>
    </Band>
  )
}

// La frase previa al cierre: las palabras se encienden a medida que se baja (Text Reveal de Magic UI)
function HomeStatement() {
  return (
    <section className="relative">
      <div className="sticky top-0 -mb-[100dvh] h-dvh">
        <BandBackdrop tone="soft" />
      </div>
      <TextReveal highlightWords={HOME_STATEMENT.highlightWords}>{HOME_STATEMENT.text}</TextReveal>
    </section>
  )
}

function HomeCourses({ cards }: { cards: ShowcaseCard[] }) {
  return (
    <Band id={HOME_SECTION_IDS.courses} className="pt-0 md:pt-0">
      <SectionTitle
        title={`${HOME_COURSES.title} ${HOME_COURSES.titleHighlight}`}
        description={HOME_COURSES.description}
      />
      <div className={CARD_GRID_CLASS}>
        {cards.map((card, index) => (
          <ContentCard key={card.key} card={card} icon="graduation-cap" index={index} />
        ))}
      </div>
    </Band>
  )
}

function HomeNotes({ cards }: { cards: ShowcaseCard[] }) {
  return (
    <Band id={HOME_SECTION_IDS.notes} tone="soft">
      <SectionTitle
        title={`${HOME_NOTES.title} ${HOME_NOTES.titleHighlight}`}
        description={HOME_NOTES.description}
        action={
          <HoverRevealLink href={ROUTES.blog} size="md" className="w-full sm:w-auto">
            {HOME_NOTES.cta}
          </HoverRevealLink>
        }
      />
      <div className={CARD_GRID_CLASS}>
        {cards.map((card, index) => (
          <ContentCard key={card.key} card={card} icon="file-text" index={index} />
        ))}
      </div>
    </Band>
  )
}

function HomeProduct() {
  return (
    <Band
      id={HOME_SECTION_IDS.products}
      tone="green"
      image="/images/home/equipo-laptop.jpg"
      className="grid items-center gap-14 md:grid-cols-2"
    >
      <BlurFade inView>
        <PhotoDuo
          image={HOME_PRODUCT.image}
          imageAlt={HOME_PRODUCT.imageAlt}
          secondImage={HOME_PRODUCT.secondImage}
          secondImageAlt={HOME_PRODUCT.secondImageAlt}
          chip={HOME_PRODUCT.chip}
        />
      </BlurFade>
      <BlurFade inView delay={0.08} className="flex flex-col items-start gap-5">
        <h2 className="font-heading text-6xl leading-none font-semibold tracking-[-0.01em] sm:text-7xl">
          {HOME_PRODUCT.title}
        </h2>
        <p className="max-w-lg text-lg leading-relaxed text-pretty sm:text-xl">{HOME_PRODUCT.description}</p>
        <HoverRevealLink href={ROUTES.quiero} className="mt-2 w-full sm:w-auto">
          {HOME_PRODUCT.cta}
        </HoverRevealLink>
      </BlurFade>
    </Band>
  )
}

type Voice = (typeof HOME_VOICES.samples)[number]

function HomeVoices({ voices }: { voices: Voice[] }) {
  return (
    <Band tone="pink">
      <SectionTitle title={`${HOME_VOICES.title} ${HOME_VOICES.titleHighlight}`} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
        {voices.map((voice, index) => (
          <BlurFade key={voice.name} inView delay={index * 0.06}>
            <figure className="flex h-full flex-col justify-between gap-6 rounded-xl bg-background p-6 shadow-[0_20px_36px_-20px_rgb(26_26_26/0.45)]">
              <blockquote className="font-heading text-xl leading-snug font-medium text-pretty">
                {voice.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <Avatar className="size-11">
                  <AvatarImage src={voice.image} alt="" className="object-cover" />
                  <AvatarFallback className="bg-brand-soft/60 text-sm font-medium">
                    {voice.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col text-sm">
                  <span className="font-medium">{voice.name}</span>
                  <span className="flex flex-wrap items-center gap-2 text-muted-foreground">
                    {voice.detail}
                    <SampleTag />
                  </span>
                </span>
              </figcaption>
            </figure>
          </BlurFade>
        ))}
      </div>
    </Band>
  )
}

type EventRow = { key: string; title: string; meta: string; startsAt: string; sample: boolean }

function HomeEvents({ events }: { events: EventRow[] }) {
  return (
    <Band id={HOME_SECTION_IDS.events} tone="green" image="/images/home/colegas-escalera.jpg">
      <SectionTitle title={`${HOME_EVENTS.title} ${HOME_EVENTS.titleHighlight}`} />
      <ul className="flex flex-col gap-4">
        {events.map((event, index) => {
          const date = formatDateParts(event.startsAt)
          return (
            <li key={event.key}>
              <BlurFade inView delay={index * 0.06}>
                <BrandCard contentClassName="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                  <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
                    <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-lg bg-mesh-pink">
                      <span className="font-heading text-3xl leading-none font-semibold">{date.day}</span>
                      <span className="mt-1 text-[13px] font-medium uppercase">{date.month}</span>
                    </div>
                    <div className="flex min-w-0 flex-col gap-1">
                      <h3 className="font-heading text-xl leading-snug font-semibold [overflow-wrap:anywhere] sm:text-2xl">
                        {event.title}
                      </h3>
                      <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {[date.time, event.meta].filter(Boolean).join(" · ")}
                        {event.sample && <SampleTag />}
                      </p>
                    </div>
                  </div>
                  <HoverRevealLink href={ROUTES.registro} size="md" className="w-full sm:w-auto">
                    {HOME_EVENTS.cta}
                  </HoverRevealLink>
                </BrandCard>
              </BlurFade>
            </li>
          )
        })}
      </ul>
    </Band>
  )
}

// Todo lo que depende de los datos. Una sección sin contenido no aparece.
export async function HomeShowcase() {
  const { courses, notes, events, voices } = await getShowcase()
  const available: (keyof typeof HOME_PATHS)[] = []
  if (courses.length) available.push("courses")
  if (notes.length) available.push("notes")
  available.push("products")
  if (events.length) available.push("events")

  return (
    <>
      <HomePaths available={available} />
      {courses.length > 0 && <HomeCourses cards={courses} />}
      {notes.length > 0 && <HomeNotes cards={notes} />}
      <HomeProduct />
      {voices.length > 0 && <HomeVoices voices={voices} />}
      {events.length > 0 && <HomeEvents events={events} />}
      <HomeStatement />
    </>
  )
}

export function HomeShowcaseSkeleton() {
  return (
    <div aria-hidden>
      <div className={cn(PAGE_WIDTH_CLASS, CARD_GRID_CLASS, "py-16 md:py-28")}>
        {Array.from({ length: CARDS_PER_SECTION }, (_, index) => (
          <div key={index} className="aspect-[4/3] animate-pulse rounded-xl bg-foreground/[0.04]" />
        ))}
      </div>
    </div>
  )
}

// ─── Cierre ──────────────────────────────────────────────────────────────────────────────

export function HomeClosing() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <Image src={HOME_CLOSING.image} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-30" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-linear-to-t from-primary via-primary/70 to-primary/40" />
      <LightRays color={`${BRAND_HEX.pink}40`} count={6} blur={48} className="-z-10 motion-reduce:hidden" />
      <Particles
        className="absolute inset-0 -z-10 motion-reduce:hidden"
        quantity={70}
        staticity={40}
        ease={60}
        size={0.7}
        color={BRAND_HEX.pink}
      />
      <div className={cn(PAGE_WIDTH_CLASS, "flex flex-col items-center gap-6 py-24 text-center sm:py-32")}>
        <BlurFade inView>
          <h2 className="font-heading text-5xl leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-7xl">
            {HOME_CLOSING.title} <span className="text-brand-soft">{HOME_CLOSING.titleHighlight}</span>
          </h2>
        </BlurFade>
        <p className="max-w-xl text-base leading-relaxed text-pretty text-primary-foreground/85 sm:text-xl">
          {HOME_CLOSING.description}
        </p>
        <div className="mt-3 flex w-full justify-center">
          <RegisterCta id={HOME_CLOSING_CTA_ID} label={HOME_CLOSING.cta} className="w-full sm:w-auto" />
        </div>
        <p className="font-hand text-3xl font-semibold text-brand sm:text-4xl">{HOME_CLOSING.hashtag}</p>
        <div className="flex items-center gap-3">
          <AvatarCircles images={HOME_AVATARS} />
          <span className="font-heading text-lg font-medium">{HOME_HERO.avatarsText}</span>
        </div>
      </div>
    </section>
  )
}
