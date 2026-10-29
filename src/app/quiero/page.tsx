import type { Metadata } from "next";

import { Eyebrow, PageHero } from "@/components/page-hero";
import { RegistroCta } from "@/components/registro-cta";

export const metadata: Metadata = {
  title: "QUIERO",
  description:
    "QUIERO acompaña a emprendedoras y feriantes a pasar de vender por redes a tener su tienda online.",
};

// Página provisoria: falta el contenido de la clienta y la lógica del botón según la sesión (función 2).
export default function QuieroPage() {
  return (
    <main className="relative flex min-h-svh flex-1 flex-col items-center justify-center px-5 pt-32 pb-20">
      <PageHero
        eyebrow={<Eyebrow>Un producto de Mujeres x Más</Eyebrow>}
        title="QUIERO"
        description="De vender por redes a tener tu tienda online. Te acompañamos en cada paso."
        actions={<RegistroCta className="h-14 w-full px-10 sm:w-auto">QUIERO</RegistroCta>}
      />
    </main>
  );
}
