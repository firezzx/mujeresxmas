import Image from "next/image"
import Link from "next/link"
import { cache } from "react"

import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { RegisterCta } from "@/components/cta/register-cta"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { Band, PAGE_WIDTH_CLASS, Photo, SectionTitle, ZigzagEdge } from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { BlurFade } from "@/components/ui/blur-fade"
import { ROUTES } from "@/config/navigation"
import {
  HOME_CLOSING,
  HOME_CLOSING_CTA_ID,
  HOME_COURSES,
  HOME_EVENTS,
  HOME_HERO,
  HOME_NOTES,
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

// ─── Primera pantalla ────────────────────────────────────────────────────────────────────

export function HomeHero({ ctaId }: { ctaId: string }) {
  return (
    <section className="relative overflow-hidden bg-brand-green pt-28 pb-24 md:pt-36 md:pb-36">
      <ZigzagEdge />
      <div
        className={cn(
          PAGE_WIDTH_CLASS,
          "relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16"
        )}
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
        </div>

        <BlurFade inView delay={0.1}>
          <Photo src={HOME_HERO.photo.src} alt={HOME_HERO.photo.alt} priority sizes="(min-width: 1024px) 45vw, 100vw" />
        </BlurFade>
      </div>
    </section>
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
          className="group flex h-full flex-col gap-4 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <span className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-foreground/[0.04]">
            {card.image ? (
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                sizes="(min-width: 1024px) 29rem, (min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            ) : (
              <IconBadge tone={cycleTone(index)} size="lg">
                <HoverIcon name={icon} size={24} />
              </IconBadge>
            )}
          </span>
          <span className="flex flex-col gap-2">
            <span className="font-heading text-xl leading-snug font-semibold tracking-[-0.01em] text-balance [overflow-wrap:anywhere] underline-offset-4 group-hover:underline">
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
        </Link>
      </IconHoverArea>
    </BlurFade>
  )
}

function HomeStatement() {
  return (
    <Band id={HOME_SECTION_IDS.inside}>
      <BlurFade inView>
        <p className="max-w-4xl font-heading text-3xl leading-[1.1] font-medium text-balance sm:text-5xl">
          {HOME_STATEMENT.text}
        </p>
      </BlurFade>
    </Band>
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
    <Band id={HOME_SECTION_IDS.notes} className="pt-0 md:pt-0">
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
    <Band id={HOME_SECTION_IDS.products} tone="green" className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
      <BlurFade inView>
        <Photo src={HOME_PRODUCT.image} alt={HOME_PRODUCT.imageAlt} sizes="(min-width: 768px) 45vw, 100vw" />
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
    <Band>
      <SectionTitle title={`${HOME_VOICES.title} ${HOME_VOICES.titleHighlight}`} />
      <div className={CARD_GRID_CLASS}>
        {voices.map((voice, index) => (
          <BlurFade key={voice.name} inView delay={index * 0.06}>
            <figure className="flex h-full flex-col justify-between gap-6 border-t border-foreground pt-6">
              <blockquote className="font-heading text-xl leading-snug font-medium text-pretty">
                {voice.quote}
              </blockquote>
              <figcaption className="flex flex-col text-sm">
                <span className="font-medium">{voice.name}</span>
                <span className="flex flex-wrap items-center gap-2 text-muted-foreground">
                  {voice.detail}
                  <SampleTag />
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
    <Band id={HOME_SECTION_IDS.events} className="pt-0 md:pt-0">
      <SectionTitle title={`${HOME_EVENTS.title} ${HOME_EVENTS.titleHighlight}`} />
      <ul className="border-t border-foreground">
        {events.map((event, index) => {
          const date = formatDateParts(event.startsAt)
          return (
            <li key={event.key} className="border-b border-border">
              <BlurFade
                inView
                delay={index * 0.06}
                className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:gap-8"
              >
                <div className="flex min-w-0 flex-1 items-center gap-6">
                  <div className="flex w-14 shrink-0 flex-col">
                    <span className="font-heading text-3xl leading-none font-semibold">{date.day}</span>
                    <span className="mt-1 text-[13px] font-medium uppercase">{date.month}</span>
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="font-heading text-xl leading-snug font-semibold [overflow-wrap:anywhere]">
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

  return (
    <>
      <HomeStatement />
      {courses.length > 0 && <HomeCourses cards={courses} />}
      {notes.length > 0 && <HomeNotes cards={notes} />}
      <HomeProduct />
      {voices.length > 0 && <HomeVoices voices={voices} />}
      {events.length > 0 && <HomeEvents events={events} />}
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
    <Band tone="ink" className="flex flex-col items-center gap-6 text-center">
      <BlurFade inView>
        <h2 className="font-heading text-5xl leading-[1.1] font-semibold tracking-[-0.01em] text-balance sm:text-6xl">
          {HOME_CLOSING.title} {HOME_CLOSING.titleHighlight}
        </h2>
      </BlurFade>
      <p className="max-w-xl text-base leading-relaxed text-pretty text-primary-foreground/80 sm:text-lg">
        {HOME_CLOSING.description}
      </p>
      <div className="mt-3 flex w-full justify-center">
        <RegisterCta id={HOME_CLOSING_CTA_ID} label={HOME_CLOSING.cta} className="w-full sm:w-auto" />
      </div>
      <p className="font-hand text-3xl font-semibold text-brand">{HOME_CLOSING.hashtag}</p>
    </Band>
  )
}
