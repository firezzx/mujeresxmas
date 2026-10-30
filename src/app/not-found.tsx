import type { Metadata } from "next";

import { BrandHighlight, Eyebrow, PageHero } from "@/components/page-hero";
import { HyperText } from "@/components/ui/hyper-text";
import { HoverRevealLink } from "@/components/buttons/hover-reveal-link";
import { ShimmerLink } from "@/components/buttons/shimmer-link";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

// 404 propia: reemplaza la de Next.js, que inyecta estilos de modo oscuro que quedaban
// aplicados al volver al sitio.
export default function NotFound() {
  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center px-5 pt-32 pb-20">
      <PageHero
        eyebrow={
          <Eyebrow>
            <HyperText as="span" className="py-0 font-sans text-xs font-medium">
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
    </main>
  );
}
