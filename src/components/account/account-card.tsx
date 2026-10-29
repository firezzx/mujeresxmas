import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Tarjeta base del panel Mi Cuenta (mismo vidrio que las tarjetas de login y registro).
export function AccountCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={cn(
        "relative h-full overflow-hidden rounded-[28px] border border-border/70 bg-background/80 p-6 shadow-[0_1px_0_0_rgb(255_255_255/0.6)_inset,0_16px_48px_-24px_rgb(40_20_40/0.22)] backdrop-blur-xl sm:p-7",
        className
      )}
    >
      {children}
    </section>
  )
}

type EmptySectionProps = {
  icon: LucideIcon
  title: string
  emptyTitle: string
  emptyText: string
}

// Sección todavía sin contenido (cursos, eventos, notificaciones) con su estado vacío.
export function EmptySection({ icon: Icon, title, emptyTitle, emptyText }: EmptySectionProps) {
  return (
    <AccountCard>
      <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      <div className="mt-5 flex flex-col items-center rounded-[20px] border border-dashed border-border px-4 py-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft">
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        <p className="mt-4 font-heading text-lg font-semibold tracking-[-0.01em]">{emptyTitle}</p>
        <p className="mt-1 max-w-[30ch] text-sm leading-relaxed text-pretty text-muted-foreground">{emptyText}</p>
      </div>
    </AccountCard>
  )
}
