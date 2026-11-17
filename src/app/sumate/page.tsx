import type { Metadata } from "next"

import { SumatePage } from "@/components/sumate/sumate-page"
import { SIGNUP_PAGE } from "@/content/sumate"

export const metadata: Metadata = {
  title: "Sumate a la comunidad",
  description: SIGNUP_PAGE.metaDescription,
}

// Registro único: nombre y apellido, email y país para la lista de correos de la comunidad
export default function Page() {
  return <SumatePage />
}
