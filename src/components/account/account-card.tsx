import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { IconBadge, type IconBadgeTone } from "@/components/icon-badge"
import { MagicCard } from "@/components/ui/magic-card"
import { BRAND_HEX } from "@/config/brand-effects"
import { cn } from "@/lib/utils"

// Magic Card de Magic UI con los colores de la marca: el borde y un halo suave siguen al mouse.
// Es la tarjeta de todo el sitio (Mi cuenta, admin, login y registro).
export function BrandCard({
  className,
  contentClassName,
  children,
}: {
  className?: string
  contentClassName?: string
  children: React.ReactNode
}) {
  return (
    <MagicCard
      gradientSize={280}
      gradientFrom={BRAND_HEX.brand}
      gradientTo={BRAND_HEX.pink}
      gradientColor={BRAND_HEX.pinkTint}
      gradientOpacity={0.7}
      className={cn(
        "h-full rounded-xl shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_16px_48px_-24px_rgb(26_26_26/0.22)]",
        className
      )}
    >
      <div className={cn("h-full", contentClassName)}>{children}</div>
    </MagicCard>
  )
}

// Celda base de Mi cuenta y del panel de administración.
export function AccountCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <BrandCard>
      <section className={cn("relative h-full p-6 sm:p-8", className)}>{children}</section>
    </BrandCard>
  )
}

type EmptySectionProps = {
  icon: IconName
  tone?: IconBadgeTone
  title: string
  emptyTitle: string
  emptyText: string
}

// Sección todavía sin contenido (cursos, eventos, notificaciones) con su estado vacío.
// El ícono se anima al pasar el mouse sobre la tarjeta.
export function EmptySection({ icon, tone, title, emptyTitle, emptyText }: EmptySectionProps) {
  return (
    <IconHoverArea className="h-full">
      <AccountCard>
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        <div className="mt-5 flex flex-col items-center rounded-lg border border-dashed border-border px-4 py-8 text-center">
          <IconBadge tone={tone}>
            <HoverIcon name={icon} size={20} />
          </IconBadge>
          <p className="mt-4 font-heading text-lg font-semibold tracking-[-0.01em]">{emptyTitle}</p>
          <p className="mt-1 max-w-[30ch] text-sm leading-relaxed text-pretty text-muted-foreground">{emptyText}</p>
        </div>
      </AccountCard>
    </IconHoverArea>
  )
}
