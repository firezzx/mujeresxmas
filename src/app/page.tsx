import { BrandHighlight, Eyebrow, PageHero } from "@/components/page-hero";
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link";
import {
  FloatingRegisterCta,
  RegisterCta,
} from "@/components/cta/register-cta";
import {
  HomeAbout,
  HomeAreas,
  HomeClosing,
  HomeCommunity,
  HomePhotoStrip,
  HomeStats,
} from "@/components/home/home-sections";
import { GridSection } from "@/components/home/grid-section";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Particles } from "@/components/ui/particles";
import { BRAND_HEX } from "@/config/brand-effects";
import { PILLARS } from "@/config/site";
import { HOME_CLOSING_CTA_ID, HOME_HERO } from "@/content/home";

const HERO_CTA_ID = "cta-registro";

// Home con textos provisorios (src/content/home.ts), a la espera del contenido definitivo.
export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <GridSection first>
        <div className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-36 pb-20 sm:pt-44 sm:pb-28">
          {/* Resplandor naranja de la marca que sube desde abajo del título */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_100%,color-mix(in_oklab,var(--brand)_24%,transparent),transparent)]"
          />
          {/* Partículas de marca que reaccionan suave al mouse */}
          <Particles
            className="absolute inset-0 motion-reduce:hidden"
            quantity={70}
            staticity={40}
            ease={60}
            size={0.6}
            color={BRAND_HEX.brand}
          />

          <PageHero
            eyebrow={
              <Eyebrow>
                <AnimatedShinyText className="mx-0">
                  {PILLARS.join(" · ")}
                </AnimatedShinyText>
              </Eyebrow>
            }
            title={
              <>
                {HOME_HERO.titleStart}{" "}
                <BrandHighlight>{HOME_HERO.titleHighlight}</BrandHighlight>
              </>
            }
            description={HOME_HERO.description}
            actions={
              <>
                <RegisterCta id={HERO_CTA_ID} className="w-full sm:w-auto" />
                <HoverRevealLink href="/quiero" className="w-full sm:w-auto">
                  Conocé QUIERO
                </HoverRevealLink>
              </>
            }
          />
        </div>
      </GridSection>

      <HomePhotoStrip />
      <HomeAbout />
      <HomeStats />
      <HomeCommunity />
      <HomeAreas />
      <HomeClosing />

      <FloatingRegisterCta
        watchId={HERO_CTA_ID}
        hideWhileVisibleId={HOME_CLOSING_CTA_ID}
      />
    </main>
  );
}
