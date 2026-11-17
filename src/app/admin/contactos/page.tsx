import type { Metadata } from "next"
import { Suspense } from "react"

import {
  AdminEmpty,
  AdminList,
  AdminLoadError,
  AdminRow,
  AdminSection,
  AdminSectionSkeleton,
} from "@/components/admin/admin-ui"
import { EmailCampaignForm } from "@/components/admin/email-campaign-form"
import { MaterialLeadsTable } from "@/components/admin/material-leads-table"
import { SignupIntroForm } from "@/components/admin/signup-intro-form"
import { Band } from "@/components/page-band"
import { ROUTES } from "@/config/navigation"
import { ALL_AUDIENCE } from "@/content/sumate"
import { isEmailConfigured } from "@/lib/email"
import { formatDateTime, formatShortDate } from "@/lib/format"
import { listEmailCampaigns, listMaterialLeads } from "@/lib/material-leads"
import { getSignupIntro } from "@/lib/site-texts"

export const metadata: Metadata = {
  title: "Contactos · Administración",
  robots: { index: false },
}

// Sección Contactos: quienes se sumaron desde /sumate, correos masivos para ellas y el
// historial de lo enviado.
export default function AdminContactsPage() {
  return (
    <Suspense
      fallback={
        <Band className="py-3 md:py-3">
          <AdminSectionSkeleton />
        </Band>
      }
    >
      <Contacts />
    </Suspense>
  )
}

async function Contacts() {
  const [leads, intro] = await Promise.all([listMaterialLeads(), getSignupIntro()])
  if (!leads) {
    return (
      <Band className="py-3 md:py-3">
        <AdminLoadError />
      </Band>
    )
  }

  const countries = [...new Set(leads.map((lead) => lead.country))].sort((a, b) => a.localeCompare(b, "es"))
  const subscribed = leads.filter((lead) => lead.subscribed)
  const audiences = [
    { value: ALL_AUDIENCE, label: "Todas las suscriptas", count: subscribed.length },
    ...countries.map((country) => ({
      value: country,
      label: country,
      count: subscribed.filter((lead) => lead.country === country).length,
    })),
  ]

  return (
    <>
      <AdminSection
        title="Textos de la página de registro"
        description="El título, la descripción y los puntos que se ven en /sumate, al lado del formulario."
        action={
          <a
            href={ROUTES.sumate}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-brand-green-strong underline-offset-4 hover:underline"
          >
            Ver la página
          </a>
        }
      >
        <SignupIntroForm intro={intro} />
      </AdminSection>

      <AdminSection
        title="Enviar un correo"
        description="Un mail a todas las personas que se sumaron y siguen suscriptas, o solo a las de un país."
      >
        <EmailCampaignForm audiences={audiences} emailReady={isEmailConfigured()} />
      </AdminSection>

      <AdminSection
        title="Contactos"
        description="Nombre y apellido, email y país de quienes se sumaron desde la página de registro."
      >
        <MaterialLeadsTable
          countries={countries}
          leads={leads.map((lead) => ({ ...lead, createdLabel: formatShortDate(lead.createdAt) }))}
        />
      </AdminSection>

      <AdminSection title="Correos enviados">
        <Suspense fallback={<AdminSectionSkeleton />}>
          <SentCampaigns />
        </Suspense>
      </AdminSection>
    </>
  )
}

async function SentCampaigns() {
  const campaigns = await listEmailCampaigns()
  if (!campaigns) return <AdminLoadError />
  if (!campaigns.length) {
    return (
      <AdminEmpty
        icon="send"
        tone="green"
        title="Todavía no enviaste correos"
        text="Los que mandes van a aparecer acá, con a cuántas personas les llegaron."
      />
    )
  }

  return (
    <AdminList>
      {campaigns.map((campaign) => (
        <AdminRow
          key={campaign.id}
          title={campaign.subject}
          detail={campaign.audience === ALL_AUDIENCE ? "Todas las suscriptas" : campaign.audience}
          aside={
            <>
              <span>{formatDateTime(campaign.createdAt)}</span>
              <span className="rounded-md bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-foreground">
                {campaign.recipients} {campaign.recipients === 1 ? "enviado" : "enviados"}
              </span>
              {campaign.failed > 0 && (
                <span className="rounded-md px-2.5 py-0.5 text-xs font-medium text-destructive ring-1 ring-destructive/30">
                  {campaign.failed} con error
                </span>
              )}
            </>
          }
        />
      ))}
    </AdminList>
  )
}
