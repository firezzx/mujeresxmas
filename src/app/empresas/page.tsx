import type { Metadata } from "next"

import { CompaniesPage } from "@/components/companies/companies-page"
import { COMPANIES_PAGE } from "@/content/empresas"

export const metadata: Metadata = {
  title: "Empresas",
  description: COMPANIES_PAGE.metaDescription,
}

// Empresas: membresías patrocinadas y formulario para pedir una propuesta
export default function Page() {
  return <CompaniesPage />
}
