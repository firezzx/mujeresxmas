import type { Metadata } from "next";

import { RegistroCta } from "@/components/registro-cta";

export const metadata: Metadata = {
  title: "QUIERO",
  description:
    "QUIERO acompaña a emprendedoras y feriantes a pasar de vender por redes a tener su tienda online.",
};

// Página provisoria: falta el contenido de la clienta y la lógica del botón según la sesión (función 2).
export default function QuieroPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          QUIERO
        </h1>
        <p className="text-lg text-muted-foreground">
          De vender por redes a tener tu tienda online.
        </p>
        <RegistroCta>QUIERO</RegistroCta>
      </div>
    </main>
  );
}
