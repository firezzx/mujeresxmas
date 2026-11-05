import type { Metadata } from "next";

import { HoverRevealLink } from "@/components/buttons/hover-reveal-link";
import { ShimmerLink } from "@/components/buttons/shimmer-link";
import { DOTS_MASK_CLASS, GhostWord, ZigzagEdge } from "@/components/page-band";
import { BrandHighlight, Eyebrow, PageHero } from "@/components/page-hero";
import { DotPattern } from "@/components/ui/dot-pattern";
import { HyperText } from "@/components/ui/hyper-text";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

// 404 propia: reemplaza la de Next.js, que inyecta estilos de modo oscuro que quedaban
// aplicados al volver al sitio.
export default function NotFound() {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-brand-green px-5 pt-32 pb-40">
        <DotPattern
          width={22}
          height={22}
          cr={1.2}
          className={cn("text-background/30", DOTS_MASK_CLASS)}
        />
        <GhostWord word="404" />
        <ZigzagEdge />
        <PageHero
          eyebrow={
            <Eyebrow>
              <HyperText
                as="span"
                className="py-0 font-heading text-[13px] font-medium"
              >
                Error 404
              </HyperText>
            </Eyebrow>
          }
          title={
            <>
              Esta página <BrandHighlight>no existe</BrandHighlight>
            </>
          }
          description="Puede que el link esté mal escrito o que la página se haya movido. Volvé al inicio y seguí recorriendo."
          actions={
            <>
              <ShimmerLink href="/" className="w-full sm:w-auto">
                Volver al inicio
              </ShimmerLink>
              <HoverRevealLink href="/quiero" className="w-full sm:w-auto">
                Conocé QUIERO
              </HoverRevealLink>
            </>
          }
        />
      </section>
    </main>
  );
}
