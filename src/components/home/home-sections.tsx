import { BrandCard } from "@/components/account/account-card"
import { Logo } from "@/components/brand/logo"
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link"
import { RegisterCta } from "@/components/cta/register-cta"
import { SectionHeading } from "@/components/home/section-heading"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"
import { OrbitingCircles } from "@/components/ui/orbiting-circles"
import { Particles } from "@/components/ui/particles"
import { TextAnimate } from "@/components/ui/text-animate"
import { BRAND_HEX } from "@/config/brand-effects"
import {
  HOME_ABOUT,
  HOME_AREAS,
  HOME_AREAS_ID,
  HOME_CLOSING,
  HOME_CLOSING_CTA_ID,
  HOME_COMMUNITY,
  HOME_STATS,
} from "@/content/home"
import { cn } from "@/lib/utils"

function Section({ id, className, children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-content scroll-mt-24 px-4 py-14 sm:px-6 md:py-20", className)}>
      {children}
    </section>
  )
}

type FeatureCardProps = { icon: IconName; title: string; text: string }

// Tarjeta con ícono, título y texto (Magic Card a través de BrandCard). El ícono se anima al
// pasar por cualquier parte de la tarjeta.
function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <IconHoverArea className="h-full">
      <BrandCard contentClassName="flex flex-col gap-5 p-6 sm:p-7">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft">
          <HoverIcon name={icon} size={22} />
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-xl leading-snug font-semibold tracking-[-0.02em] text-balance">{title}</h3>
          <p className="text-[15px] leading-relaxed text-pretty text-muted-foreground">{text}</p>
        </div>
      </BrandCard>
    </IconHoverArea>
  )
}

export function HomeAbout() {
  return (
    <Section>
      <SectionHeading eyebrow={HOME_ABOUT.eyebrow} title={HOME_ABOUT.title} description={HOME_ABOUT.description} />
      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-14 md:grid-cols-3">
        {HOME_ABOUT.items.map((item, index) => (
          <BlurFade key={item.title} inView delay={index * 0.08} className="h-full">
            <FeatureCard {...item} />
          </BlurFade>
        ))}
      </div>
    </Section>
  )
}

// Cifras de la comunidad: cuentan hacia arriba con Number Ticker al entrar en pantalla.
export function HomeStats() {
  return (
    <Section className="py-6 md:py-8">
      <dl className="grid grid-cols-1 divide-y divide-border rounded-[28px] border border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {HOME_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-2 px-6 py-8 text-center sm:py-10">
            <dt className="order-last text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="font-heading text-5xl leading-none font-semibold tracking-[-0.03em] md:text-6xl">
              {stat.prefix}
              <NumberTicker
                value={stat.value}
                decimalPlaces={stat.decimals}
                className="tracking-[-0.03em] text-foreground"
              />
              {stat.suffix}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

const ORBIT_ICONS: IconName[] = ["book-text", "graduation-cap", "sparkles"]
const ORBIT_ICONS_INNER: IconName[] = ["users-round", "rocket"]

function OrbitIcon({ icon }: { icon: IconName }) {
  return (
    <span className="flex size-full items-center justify-center rounded-full border border-border bg-background shadow-[0_8px_20px_-10px_rgb(26_26_26/0.3)]">
      <HoverIcon name={icon} size={18} />
    </span>
  )
}

export function HomeCommunity() {
  return (
    <Section>
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="flex flex-col items-start gap-7">
          <SectionHeading
            align="left"
            eyebrow={HOME_COMMUNITY.eyebrow}
            title={HOME_COMMUNITY.title}
            description={HOME_COMMUNITY.description}
          />
          <BlurFade inView delay={0.16}>
            <ul className="flex flex-col gap-3">
              {HOME_COMMUNITY.items.map((item) => (
                <li key={item.text}>
                  <IconHoverArea className="flex items-center gap-3 text-[15px]">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                      <HoverIcon name={item.icon} size={16} />
                    </span>
                    {item.text}
                  </IconHoverArea>
                </li>
              ))}
            </ul>
          </BlurFade>
          <BlurFade inView delay={0.22} className="w-full sm:w-auto">
            <HoverRevealLink href={`#${HOME_AREAS_ID}`} className="w-full sm:w-auto">
              {HOME_COMMUNITY.cta}
            </HoverRevealLink>
          </BlurFade>
        </div>

        {/* Orbiting Circles de Magic UI alrededor del logo */}
        <BlurFade inView delay={0.1}>
          <div
            aria-hidden
            className="relative flex h-[22rem] items-center justify-center overflow-hidden rounded-[28px] bg-brand-soft/30 sm:h-[26rem]"
          >
            <Logo className="h-8" />
            <OrbitingCircles iconSize={44} radius={142} duration={36}>
              {ORBIT_ICONS.map((icon) => (
                <OrbitIcon key={icon} icon={icon} />
              ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={38} radius={102} duration={26} reverse>
              {ORBIT_ICONS_INNER.map((icon) => (
                <OrbitIcon key={icon} icon={icon} />
              ))}
            </OrbitingCircles>
          </div>
        </BlurFade>
      </div>
    </Section>
  )
}

export function HomeAreas() {
  return (
    <Section id={HOME_AREAS_ID}>
      <SectionHeading eyebrow={HOME_AREAS.eyebrow} title={HOME_AREAS.title} description={HOME_AREAS.description} />
      {/* Dos tarjetas grandes arriba y tres abajo */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-6">
        {HOME_AREAS.items.map((item, index) => (
          <BlurFade
            key={item.title}
            inView
            delay={index * 0.06}
            className={cn(
              "h-full",
              index < 2 ? "lg:col-span-3" : "lg:col-span-2",
              index === HOME_AREAS.items.length - 1 && "sm:max-lg:col-span-2"
            )}
          >
            <FeatureCard {...item} />
          </BlurFade>
        ))}
      </div>
    </Section>
  )
}

// Cierre en negro con partículas y la invitación a sumarse, con el botón en naranja de la marca.
export function HomeClosing() {
  return (
    <Section className="pb-4 md:pb-6">
      <BlurFade inView>
        <div className="relative isolate overflow-hidden rounded-[32px] bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-24">
          <Particles
            className="absolute inset-0 -z-10 motion-reduce:hidden"
            quantity={60}
            staticity={40}
            ease={60}
            size={0.7}
            color={BRAND_HEX.brand}
          />
          <TextAnimate
            as="h2"
            animation="blurInUp"
            by="word"
            once
            duration={0.5}
            className="mx-auto max-w-3xl font-heading text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-6xl"
          >
            {HOME_CLOSING.title}
          </TextAnimate>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-pretty text-primary-foreground/70 sm:text-lg">
            {HOME_CLOSING.description}
          </p>
          <div className="mt-8 flex justify-center">
            <RegisterCta id={HOME_CLOSING_CTA_ID} label={HOME_CLOSING.cta} tone="brand" className="w-full sm:w-auto" />
          </div>
        </div>
      </BlurFade>
    </Section>
  )
}
