import type { Metadata } from "next"

import { PillarsOverview } from "@/components/pillars/pillars-overview"
import { PILLARS_PAGE } from "@/content/pilares"

export const metadata: Metadata = {
  title: "Pilares",
  description: PILLARS_PAGE.description,
}

export default function Page() {
  return <PillarsOverview />
}
