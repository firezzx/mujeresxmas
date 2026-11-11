import type { Metadata } from "next"

import { PillarPage } from "@/components/pillars/pillar-page"
import { PILLARS } from "@/content/pilares"

const pillar = PILLARS.conexion

export const metadata: Metadata = {
  title: "Conexión",
  description: pillar.hero.description,
}

export default function Page() {
  return <PillarPage pillar={pillar} />
}
