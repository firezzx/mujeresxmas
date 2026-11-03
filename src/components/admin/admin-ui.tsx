import { AccountCard } from "@/components/account/account-card"
import { GridSection } from "@/components/grid-section"
import { IconBadge, type IconBadgeTone } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { BlurFade } from "@/components/ui/blur-fade"
import { type ContentStatus, STATUS_LABELS } from "@/lib/content"
import { cn } from "@/lib/utils"

// Piezas comunes de las secciones del panel de administración.

type AdminSectionProps = {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}

// Sección del panel en la retícula, con título, descripción y acción a la derecha.
export function AdminSection({ title, description, action, children }: AdminSectionProps) {
  return (
    <GridSection>
      <BlurFade delay={0.1} inView>
        <AccountCard>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-[-0.01em]">{title}</h2>
              {description && (
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
              )}
            </div>
            {action}
          </div>
          {children}
        </AccountCard>
      </BlurFade>
    </GridSection>
  )
}

// Botón de una herramienta que todavía no está disponible.
export function ComingSoonButton({ icon, children }: { icon: IconName; children: React.ReactNode }) {
  return (
    <IconHoverArea className="shrink-0">
      <button
        type="button"
        disabled
        title="Próximamente"
        className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-lg px-5 text-sm font-medium text-foreground/60 ring-1 ring-border"
      >
        <HoverIcon name={icon} size={16} />
        {children}
        <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[11px] text-foreground">Próximamente</span>
      </button>
    </IconHoverArea>
  )
}

// Estado vacío de una lista del panel.
export function AdminEmpty({
  icon,
  tone,
  title,
  text,
}: {
  icon: IconName
  tone?: IconBadgeTone
  title: string
  text: string
}) {
  return (
    <IconHoverArea>
      <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-4 py-12 text-center">
        <IconBadge tone={tone}>
          <HoverIcon name={icon} size={20} />
        </IconBadge>
        <p className="mt-4 font-heading text-lg font-semibold tracking-[-0.01em]">{title}</p>
        <p className="mt-1 max-w-[42ch] text-sm leading-relaxed text-pretty text-muted-foreground">{text}</p>
      </div>
    </IconHoverArea>
  )
}

export function AdminLoadError() {
  return (
    <div className="rounded-lg bg-destructive/[0.06] px-4 py-5 text-sm text-destructive">
      No pudimos cargar estos datos. Revisá que las migraciones estén cargadas en Supabase y volvé a intentar.
    </div>
  )
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-md px-2.5 text-[11px] font-medium whitespace-nowrap",
        status === "published" && "bg-brand-green/25 text-foreground",
        status === "draft" && "text-muted-foreground ring-1 ring-border",
        status === "archived" && "bg-foreground/[0.06] text-muted-foreground"
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

// Fila de una lista del panel: título y detalle a la izquierda, datos a la derecha.
export function AdminRow({
  title,
  detail,
  aside,
}: {
  title: React.ReactNode
  detail?: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <li className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-medium">{title}</p>
        {detail && <p className="mt-0.5 line-clamp-2 text-[13px] text-muted-foreground">{detail}</p>}
      </div>
      {aside && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 text-[13px] text-muted-foreground">{aside}</div>
      )}
    </li>
  )
}

export function AdminList({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-border/70">{children}</ul>
}

// Esqueleto mientras carga una sección
export function AdminSectionSkeleton() {
  return <div aria-hidden className="h-72 animate-pulse rounded-xl bg-foreground/[0.05]" />
}
