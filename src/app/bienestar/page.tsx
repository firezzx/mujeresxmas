import type { Metadata } from "next"

import { SectionPage } from "@/components/section-page"
import { SECTIONS } from "@/content/secciones"

// Sin indexar hasta que la sección tenga su contenido definitivo
export const metadata: Metadata = {
  title: "Bienestar",
  robots: { index: false },
}

export default function Page() {
  return <SectionPage {...SECTIONS.bienestar} />
}
