import Image from "next/image"
import Link from "next/link"
import { cache } from "react"

import { BrandCard } from "@/components/account/account-card"
import { LogoShort } from "@/components/brand/logo"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { RegisterCta } from "@/components/cta/register-cta"
import { cycleTone, IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import {
  DOTS_MASK_CLASS,
  GhostWord,
  PAGE_WIDTH_CLASS,
  PHOTO_FRAME_CLASS,
  PhotoDuo,
  PhotoTile,
  SectionTitle,
} from "@/components/page-band"
import { BrandHighlight } from "@/components/page-hero"
import { AuroraText } from "@/components/ui/aurora-text"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarCircles } from "@/components/ui/avatar-circles"
import { BlurFade } from "@/components/ui/blur-fade"
import { BorderBeam } from "@/components/ui/border-beam"
import { DotPattern } from "@/components/ui/dot-pattern"
import { LightRays } from "@/components/ui/light-rays"
import { Marquee } from "@/components/ui/marquee"
import { Particles } from "@/components/ui/particles"
import { Ripple } from "@/components/ui/ripple"
import { ScrollVelocityContainer, ScrollVelocityRow } from "@/components/ui/scroll-based-velocity"
import { ShineBorder } from "@/components/ui/shine-border"
import { SparklesText } from "@/components/ui/sparkles-text"
import { SpinningText } from "@/components/ui/spinning-text"
import { TextReveal } from "@/components/ui/text-reveal"
import { AURORA_COLORS, BRAND_HEX } from "@/config/brand-effects"
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

const WIDTH_CLASS = PAGE_WIDTH_CLASS
const BAND_CLASS = "scroll-mt-20 py-16 md:py-24"
const CARDS_PER_SECTION = 3

// Cada tipo de contenido tiene su color, para reconocerlo en cualquier parte del sitio
const TAG_TONES = {
  course: "bg-brand-green",
  note: "bg-brand-soft",
  event: "bg-brand-soft",
  product: "bg-brand",
  sample: "bg-background ring-1 ring-foreground/20",
}

function Tag({ tone, children }: { tone: keyof typeof TAG_TONES; children: React.ReactNode }) {
  return (
    <span className={cn("w-fit rounded-md px-2.5 py-1 text-[12px] font-medium text-foreground", TAG_TONES[tone])}>
      {children}
    </span>
  )
}

// ─── Primera pantalla ────────────────────────────────────────────────────────────────────

const CHIP_POSITIONS = ["-left-2 top-[12%] sm:-left-5", "-right-2 top-[44%] sm:-right-4", "bottom-[8%] left-[18%]"]

export function HomeHero({ ctaId }: { ctaId: string }) {
  const [first, second, third] = HOME_HERO.photos
  return (
    <section className="relative overflow-hidden bg-brand-soft pt-28 pb-24 md:pt-36 md:pb-32">
      <DotPattern width={22} height={22} cr={1.2} className={cn("text-foreground/15", DOTS_MASK_CLASS)} />
      <div
        className={cn(
          WIDTH_CLASS,
          "relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16"
        )}
      >
        <div className="flex flex-col items-start gap-6">
          <BlurFade inView>
            <h1 className="font-heading text-[2.75rem] leading-[1.1] font-semibold tracking-[-0.035em] text-balance sm:text-6xl xl:text-[5rem]">
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
              <span className="font-heading text-lg font-medium tracking-[-0.01em]">{HOME_HERO.avatarsText}</span>
            </div>
          </BlurFade>
        </div>

        <BlurFade inView delay={0.1} className="relative">
          {/* Bloques de color detrás de las fotos, como un collage */}
          <div
            aria-hidden
            className="absolute -top-5 -left-4 h-3/5 w-1/2 -rotate-6 rounded-xl bg-brand-green sm:-left-7"
          />
          <div
            aria-hidden
            className="absolute -right-3 -bottom-5 h-2/5 w-2/5 rotate-6 rounded-xl bg-brand sm:-right-6"
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
              <BorderBeam size={120} duration={9} colorFrom={BRAND_HEX.brand} colorTo={BRAND_HEX.pink} />
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
              style={{ animationDelay: `${index * -2}s` }}
              className={cn(
                "absolute z-10 flex animate-float items-center gap-2 rounded-lg bg-background px-3 py-2 text-[13px] font-medium whitespace-nowrap shadow-[0_12px_28px_-10px_rgb(26_26_26/0.4)] motion-reduce:animate-none sm:text-sm",
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
          {/* Sello que gira (Spinning Text de Magic UI) */}
          <div className="absolute -bottom-9 left-1/2 z-20 flex size-28 -translate-x-1/2 items-center justify-center rounded-full bg-foreground text-background shadow-[0_16px_32px_-12px_rgb(26_26_26/0.6)] motion-reduce:hidden sm:size-32">
            <SpinningText duration={16} radius={5.6} className="text-[11px] font-medium sm:text-xs">
              {HOME_HERO.badge}
            </SpinningText>
            <LogoShort className="absolute" />
          </div>
        </BlurFade>
      </div>
    </section>
  )
}

// Dos cintas cruzadas con palabras en movimiento, que aceleran al bajar (Scroll Based Velocity de Magic UI)
function RibbonWords({ words, dotClass }: { words: string[]; dotClass: string }) {
  return (
    <span className="flex items-center">
      {[...words, ...words].map((word, index) => (
        <span key={index} className="flex items-center">
          <span className="px-5 font-heading text-2xl font-semibold tracking-[-0.02em] sm:px-8 sm:text-4xl">
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
    <div
      aria-hidden
      className="relative z-10 h-36 overflow-x-clip bg-linear-to-b from-brand-soft from-50% to-background to-50% sm:h-48"
    >
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
    voices: SHOW_SAMPLES ? HOME_VOICES.samples : [],
  }
})

function ContentCard({
  card,
  tag,
  tone,
  icon,
  index,
}: {
  card: ShowcaseCard
  tag: string
  tone: "course" | "note"
  icon: IconName
  index: number
}) {
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
                  sizes="(min-width: 1024px) 29rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
                />
              ) : (
                <IconBadge tone={cycleTone(index)} size="lg">
                  <HoverIcon name={icon} size={24} />
                </IconBadge>
              )}
              <span className="absolute bottom-3 left-3 rounded-md bg-background px-2.5 py-1 text-[12px] font-medium shadow-[0_8px_16px_-8px_rgb(26_26_26/0.5)]">
                {card.meta}
              </span>
            </span>
            <span className="flex flex-wrap gap-1.5 px-2">
              <Tag tone={tone}>{tag}</Tag>
              {card.sample && <Tag tone="sample">Ejemplo</Tag>}
            </span>
            <span className="px-2 font-heading text-xl leading-snug font-semibold tracking-[-0.02em] text-balance [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-brand sm:text-2xl">
              {card.title}
            </span>
            {card.text && (
              <span className="line-clamp-3 px-2 text-[15px] leading-relaxed text-pretty [overflow-wrap:anywhere] text-muted-foreground">
                {card.text}
              </span>
            )}
          </BrandCard>
        </Link>
      </IconHoverArea>
    </BlurFade>
  )
}

const CARD_GRID_CLASS =
  "grid grid-cols-[minmax(0,1fr)] gap-x-5 gap-y-8 md:grid-cols-3 md:[&>*:nth-child(2)]:mt-10 lg:gap-x-8"

// Cómo se reparten las celdas según cuántas secciones tienen contenido
const TILE_LAYOUTS: Record<number, string[]> = {
  1: ["col-span-2 lg:col-span-4"],
  2: ["col-span-2", "col-span-2"],
  3: ["col-span-2 lg:row-span-2", "lg:col-span-2", "lg:col-span-2"],
  4: ["col-span-2 lg:row-span-2", "", "", "col-span-2"],
}

// Lo que hay en el sitio. Solo aparece lo de las secciones que tienen contenido.
function HomePaths({ available }: { available: (keyof typeof HOME_PATHS)[] }) {
  const layout = TILE_LAYOUTS[available.length]
  return (
    <section id={HOME_SECTION_IDS.inside} className="scroll-mt-20 pt-6 pb-16 md:pb-24">
      <div className={WIDTH_CLASS}>
        <SectionTitle
          title={HOME_INSIDE.title}
          highlight={HOME_INSIDE.titleHighlight}
          highlightStyle={{ action: "box", color: BRAND_HEX.green }}
        />
        <ul className="grid auto-rows-[13rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:gap-4 lg:auto-rows-[17rem] lg:grid-cols-4">
          {available.map((key, index) => (
            <li key={key} className={cn("min-w-0", layout[index])}>
              <PhotoTile {...HOME_PATHS[key]} index={index} href={`#${HOME_SECTION_IDS[key]}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function HomeCourses({ cards }: { cards: ShowcaseCard[] }) {
  return (
    <section id={HOME_SECTION_IDS.courses} className={cn(BAND_CLASS, "pt-0 md:pt-0")}>
      <div className={WIDTH_CLASS}>
        <SectionTitle
          title={HOME_COURSES.title}
          highlight={HOME_COURSES.titleHighlight}
          highlightStyle={{ action: "underline", color: BRAND_HEX.brand }}
          description={HOME_COURSES.description}
        />
        <ul aria-label="Temas" className="mb-8 flex flex-wrap gap-2 md:mb-10">
          {HOME_COURSES.topics.map((topic) => (
            <li key={topic} className="rounded-md bg-foreground/[0.05] px-3 py-1.5 text-[13px] font-medium">
              {topic}
            </li>
          ))}
        </ul>
        <div className={CARD_GRID_CLASS}>
          {cards.map((card, index) => (
            <ContentCard key={card.key} card={card} tag="Curso" tone="course" icon="graduation-cap" index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function NoteMedia({ card, sizes, className }: { card: ShowcaseCard; sizes: string; className: string }) {
  return (
    <span
      className={cn("relative flex items-center justify-center overflow-hidden rounded-lg bg-brand-soft/35", className)}
    >
      {card.image ? (
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
        />
      ) : (
        <IconBadge tone="pink" size="lg">
          <HoverIcon name="file-text" size={24} />
        </IconBadge>
      )}
    </span>
  )
}

const NOTE_LINK_CLASS =
  "group block h-full rounded-xl outline-none transition-transform duration-500 ease-premium hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring/40"
const NOTE_TITLE_CLASS =
  "font-heading font-semibold tracking-[-0.02em] text-balance [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-brand"

function NoteTags({ sample }: { sample: boolean }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      <Tag tone="note">Nota</Tag>
      {sample && <Tag tone="sample">Ejemplo</Tag>}
    </span>
  )
}

function FeaturedNote({ card, alone }: { card: ShowcaseCard; alone: boolean }) {
  return (
    <IconHoverArea className="h-full">
      <Link href={card.href} className={NOTE_LINK_CLASS}>
        <BrandCard
          contentClassName={cn(
            "flex flex-col gap-5 p-3 sm:p-4",
            alone && "md:grid md:grid-cols-2 md:items-center md:gap-10"
          )}
        >
          <NoteMedia card={card} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[16/10]" />
          <span className="flex flex-col gap-3 px-2 pb-3">
            <NoteTags sample={card.sample} />
            <span className={cn(NOTE_TITLE_CLASS, "text-2xl leading-tight sm:text-4xl")}>{card.title}</span>
            {card.text && (
              <span className="line-clamp-3 text-base leading-relaxed text-pretty [overflow-wrap:anywhere] text-muted-foreground">
                {card.text}
              </span>
            )}
            <span className="text-[13px] text-muted-foreground">{card.meta}</span>
          </span>
        </BrandCard>
      </Link>
    </IconHoverArea>
  )
}

function SideNote({ card }: { card: ShowcaseCard }) {
  return (
    <IconHoverArea className="h-full">
      <Link href={card.href} className={NOTE_LINK_CLASS}>
        <BrandCard contentClassName="flex h-full items-center gap-4 p-3 sm:gap-5 sm:p-4 lg:min-h-48">
          <NoteMedia
            card={card}
            sizes="10rem"
            className="aspect-square w-24 shrink-0 sm:w-40 lg:aspect-auto lg:w-[42%] lg:self-stretch"
          />
          <span className="flex min-w-0 flex-col gap-2">
            <NoteTags sample={card.sample} />
            <span className={cn(NOTE_TITLE_CLASS, "text-lg leading-snug sm:text-xl")}>{card.title}</span>
            <span className="text-[13px] text-muted-foreground">{card.meta}</span>
          </span>
        </BrandCard>
      </Link>
    </IconHoverArea>
  )
}

function HomeNotes({ cards }: { cards: ShowcaseCard[] }) {
  const [featured, ...others] = cards
  return (
    <section id={HOME_SECTION_IDS.notes} className={cn(BAND_CLASS, "relative overflow-hidden bg-brand-soft/25")}>
      <DotPattern width={22} height={22} cr={1.2} className={cn("text-brand-pink-strong/25", DOTS_MASK_CLASS)} />
      <div className={cn(WIDTH_CLASS, "relative")}>
        <SectionTitle
          title={HOME_NOTES.title}
          highlight={HOME_NOTES.titleHighlight}
          highlightStyle={{ action: "highlight", color: BRAND_HEX.pink }}
          description={HOME_NOTES.description}
          action={
            <HoverRevealLink href={ROUTES.blog} className="w-full sm:w-auto">
              {HOME_NOTES.cta}
            </HoverRevealLink>
          }
        />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-5">
          <BlurFade inView className={cn("min-w-0", others.length ? "lg:col-span-3" : "lg:col-span-5")}>
            <FeaturedNote card={featured} alone={!others.length} />
          </BlurFade>
          {others.length > 0 && (
            <div className="flex min-w-0 flex-col gap-5 lg:col-span-2">
              {others.map((card, index) => (
                <BlurFade key={card.key} inView delay={(index + 1) * 0.06} className="min-w-0 flex-1">
                  <SideNote card={card} />
                </BlurFade>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// El producto de la comunidad: el naranja de la marca a todo el ancho, con ondas (Ripple de Magic UI).
// El texto va en negro por contraste.
function HomeProduct() {
  return (
    <section id={HOME_SECTION_IDS.products} className="relative scroll-mt-20 overflow-hidden bg-brand">
      <Ripple
        mainCircleSize={320}
        mainCircleOpacity={0.12}
        numCircles={5}
        className="[mask-image:radial-gradient(70%_70%_at_50%_50%,white,transparent)]"
      />
      <GhostWord word={HOME_PRODUCT.title} />
      <div className={cn(WIDTH_CLASS, "relative grid items-center gap-14 py-16 md:grid-cols-2 md:py-28")}>
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
          <span className="w-fit rounded-md bg-background px-2.5 py-1 text-[12px] font-medium">{HOME_PRODUCT.tag}</span>
          <h2 className="font-heading text-6xl leading-none font-semibold tracking-[-0.03em] sm:text-8xl xl:text-[7.5rem]">
            <SparklesText
              colors={{ first: BRAND_HEX.white, second: BRAND_HEX.pink }}
              sparklesCount={6}
              className="text-[length:inherit] font-[inherit]"
            >
              {HOME_PRODUCT.title}
            </SparklesText>
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-pretty sm:text-xl">{HOME_PRODUCT.description}</p>
          <ul className="flex flex-wrap gap-2">
            {HOME_PRODUCT.steps.map((step) => (
              <li key={step} className="rounded-md bg-foreground px-3 py-1.5 text-[13px] font-medium text-background">
                {step}
              </li>
            ))}
          </ul>
          <HoverRevealLink href={ROUTES.quiero} className="mt-2 w-full sm:w-auto">
            {HOME_PRODUCT.cta}
          </HoverRevealLink>
        </BlurFade>
      </div>
    </section>
  )
}

type Voice = (typeof HOME_VOICES.samples)[number]

const VOICE_TONES = [
  "bg-background -rotate-1",
  "bg-brand rotate-1",
  "bg-foreground text-background -rotate-1",
  "bg-brand-green rotate-1",
]

function VoiceCard({ voice, index }: { voice: Voice; index: number }) {
  return (
    <figure
      className={cn(
        "flex h-full w-[19rem] flex-col justify-between gap-6 rounded-xl p-6 shadow-[0_20px_36px_-20px_rgb(26_26_26/0.55)] sm:w-[24rem]",
        VOICE_TONES[index % VOICE_TONES.length]
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <span aria-hidden className="font-heading text-6xl leading-[0.7] font-semibold">
            “
          </span>
          <Tag tone="sample">Ejemplo</Tag>
        </div>
        <blockquote className="font-heading text-xl leading-snug font-medium tracking-[-0.01em] text-pretty sm:text-2xl">
          {voice.quote}
        </blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarImage src={voice.image} alt="" className="object-cover" />
          <AvatarFallback className="bg-brand-soft/60 text-[13px] font-medium">{voice.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="flex flex-col text-sm">
          <span className="font-medium">{voice.name}</span>
          <span className="opacity-85">{voice.detail}</span>
        </span>
      </figcaption>
    </figure>
  )
}

const MARQUEE_EDGES_CLASS = "[mask-image:linear-gradient(to_right,transparent,white_5%,white_95%,transparent)]"

// Voces de la comunidad en dos filas que se mueven en sentidos opuestos (Marquee de Magic UI).
function HomeVoices({ voices }: { voices: Voice[] }) {
  return (
    <section className={cn(BAND_CLASS, "overflow-hidden bg-brand-soft")}>
      <div className={WIDTH_CLASS}>
        <SectionTitle
          title={HOME_VOICES.title}
          highlight={HOME_VOICES.titleHighlight}
          highlightStyle={{ action: "circle", color: BRAND_HEX.brand }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Marquee pauseOnHover repeat={3} className={cn("[--duration:55s] [--gap:1rem] py-4", MARQUEE_EDGES_CLASS)}>
          {voices.map((voice, index) => (
            <VoiceCard key={voice.name} voice={voice} index={index} />
          ))}
        </Marquee>
        <Marquee
          reverse
          pauseOnHover
          repeat={3}
          className={cn("[--duration:65s] [--gap:1rem] py-4 max-md:hidden", MARQUEE_EDGES_CLASS)}
        >
          {[...voices].reverse().map((voice, index) => (
            <VoiceCard key={voice.name} voice={voice} index={index + 1} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}

type EventRow = { key: string; title: string; meta: string; startsAt: string; sample: boolean }

function HomeEvents({ events }: { events: EventRow[] }) {
  return (
    <section id={HOME_SECTION_IDS.events} className={cn(BAND_CLASS, "relative overflow-hidden bg-brand-green")}>
      <DotPattern width={22} height={22} cr={1.2} className={cn("text-background/30", DOTS_MASK_CLASS)} />
      <div className={cn(WIDTH_CLASS, "relative")}>
        <SectionTitle
          title={HOME_EVENTS.title}
          highlight={HOME_EVENTS.titleHighlight}
          highlightStyle={{ action: "underline", color: BRAND_HEX.white }}
        />
        <ul className="flex flex-col gap-4">
          {events.map((event, index) => {
            const date = formatDateParts(event.startsAt)
            return (
              <li key={event.key}>
                <BlurFade inView delay={index * 0.06} className="relative rounded-xl">
                  <BrandCard contentClassName="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
                    <div className="flex items-center gap-4 sm:contents">
                      {/* Hojita de calendario */}
                      <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-soft -rotate-2 shadow-[0_10px_20px_-12px_rgb(26_26_26/0.5)]">
                        <span className="font-heading text-3xl leading-none font-semibold">{date.day}</span>
                        <span className="mt-1 text-[12px] font-medium uppercase">{date.month}</span>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <h3 className="font-heading text-xl leading-snug font-semibold tracking-[-0.02em] [overflow-wrap:anywhere] sm:text-2xl">
                          {event.title}
                        </h3>
                        {index === 0 && (
                          <span className="order-first w-fit rounded-md bg-brand px-2.5 py-1 text-[12px] font-medium">
                            {HOME_EVENTS.nextLabel}
                          </span>
                        )}
                        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          {[date.time, event.meta].filter(Boolean).join(" · ")}
                          {event.sample && <Tag tone="sample">Ejemplo</Tag>}
                        </p>
                      </div>
                    </div>
                    <HoverRevealLink href={ROUTES.registro} className="w-full sm:w-auto">
                      {HOME_EVENTS.cta}
                    </HoverRevealLink>
                  </BrandCard>
                  {index === 0 && (
                    <ShineBorder borderWidth={3} duration={10} shineColor={[BRAND_HEX.brand, BRAND_HEX.pink]} />
                  )}
                </BlurFade>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

// Todo lo que depende de los datos. Una sección sin contenido no aparece, ni su acceso de arriba.
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
      <TextReveal highlightWords={HOME_STATEMENT.highlightWords}>{HOME_STATEMENT.text}</TextReveal>
      {voices.length > 0 && <HomeVoices voices={voices} />}
      {events.length > 0 && <HomeEvents events={events} />}
    </>
  )
}

export function HomeShowcaseSkeleton() {
  return (
    <div aria-hidden>
      <div className={cn(WIDTH_CLASS, CARD_GRID_CLASS, "py-16 md:py-24")}>
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
      <Image src={HOME_CLOSING.image} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-linear-to-t from-primary via-primary/70 to-primary/40" />
      <LightRays color={`${BRAND_HEX.brand}66`} count={6} blur={48} className="-z-10 motion-reduce:hidden" />
      <Particles
        className="absolute inset-0 -z-10 motion-reduce:hidden"
        quantity={70}
        staticity={40}
        ease={60}
        size={0.7}
        color={BRAND_HEX.pink}
      />
      <div className={cn(WIDTH_CLASS, "flex flex-col items-center gap-6 py-24 text-center sm:py-36")}>
        <BlurFade inView>
          <h2 className="font-heading text-5xl leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-7xl xl:text-8xl">
            {HOME_CLOSING.title} <AuroraText colors={AURORA_COLORS}>{HOME_CLOSING.titleHighlight}</AuroraText>
          </h2>
        </BlurFade>
        <p className="max-w-xl text-base leading-relaxed text-pretty text-primary-foreground/85 sm:text-xl">
          {HOME_CLOSING.description}
        </p>
        <div className="mt-3 flex w-full justify-center">
          <RegisterCta id={HOME_CLOSING_CTA_ID} label={HOME_CLOSING.cta} tone="brand" className="w-full sm:w-auto" />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <AvatarCircles images={HOME_AVATARS} />
          <span className="font-heading text-lg font-medium tracking-[-0.01em]">{HOME_HERO.avatarsText}</span>
        </div>
      </div>
    </section>
  )
}
