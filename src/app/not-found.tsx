import type { Metadata } from "next";

import { Eyebrow, PageHero } from "@/components/page-hero";
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
        eyebrow={<Eyebrow>Error 404</Eyebrow>}
        title={
          <>
            Esta página <span className="text-brand">no existe</span>
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
