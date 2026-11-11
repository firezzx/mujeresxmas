import type { Metadata } from "next"

import { PillarPage } from "@/components/pillars/pillar-page"
import { PILLARS } from "@/content/pilares"

const pillar = PILLARS.desarrollo

export const metadata: Metadata = {
  title: "Desarrollo",
  description: pillar.hero.description,
}

export default function Page() {
  return <PillarPage pillar={pillar} />
}
