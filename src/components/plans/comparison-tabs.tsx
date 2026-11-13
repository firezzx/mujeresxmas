"use client"

import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { MEMBERSHIP_COMPARISON } from "@/content/membresia"
import { cn } from "@/lib/utils"

const ease = [0.22, 1, 0.36, 1] as const
const GRID = "md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]"

function Cell({ value }: { value: string | null }) {
  if (!value) {
    return (
      <span aria-label="No incluido" className="text-muted-foreground/50">
        —
      </span>
    )
  }
  const included = value.startsWith("Incluid")
  return (
    <span
      className={cn(
        "inline-flex items-start gap-1.5 md:justify-center",
        included && "font-medium text-brand-green-strong"
      )}
    >
      {included && <HoverIcon name="check" size={15} className="mt-0.5 shrink-0" />}
      {value}
    </span>
  )
}

// Comparativa en pestañas, una por pilar: menos scroll y cada tabla se lee de un vistazo. En
// escritorio es una tabla con la columna destacada teñida; en el celular cada beneficio muestra
// sus tres valores debajo.
export function ComparisonTabs() {
  const { plans, groups, featuredIndex } = MEMBERSHIP_COMPARISON
  const [active, setActive] = useState(0)
  const group = groups[active]

  return (
    <div className="rounded-xl bg-background p-2 shadow-[0_1px_2px_rgb(26_26_26/0.04),0_24px_60px_-28px_rgb(26_26_26/0.25)] ring-1 ring-foreground/[0.08] sm:p-3">
      <div role="tablist" aria-label="Pilares" className="grid grid-cols-3 gap-1.5 rounded-lg bg-muted/60 p-1.5">
        {groups.map((item, index) => {
          const selected = index === active
          return (
            <IconHoverArea key={item.pillar}>
              <button
                type="button"
                role="tab"
                id={`pilar-tab-${index}`}
                aria-selected={selected}
                aria-controls="pilar-panel"
                onClick={() => setActive(index)}
                className={cn(
                  "relative isolate flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 font-heading text-sm font-semibold transition-colors duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40 sm:text-base",
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="pillar-tab"
                    transition={{ duration: 0.4, ease }}
                    className="absolute inset-0 -z-10 rounded-md bg-background shadow-[0_6px_16px_-8px_rgb(26_26_26/0.3)] ring-1 ring-foreground/[0.06]"
                  />
                )}
                <HoverIcon name={item.icon} size={17} className="hidden text-brand-green-strong sm:block" />
                {item.pillar}
              </button>
            </IconHoverArea>
          )
        })}
      </div>

      <div
        className={cn(
          "mt-3 hidden items-center gap-4 rounded-lg bg-primary px-5 py-4 text-primary-foreground md:grid",
          GRID
        )}
      >
        <span className="text-sm text-white/70">{MEMBERSHIP_COMPARISON.benefitLabel}</span>
        {plans.map((plan, index) => (
          <span
            key={plan}
            className="flex items-center justify-center gap-2 font-heading text-lg leading-none font-semibold"
          >
            {plan}
            {index === featuredIndex && (
              <>
                <span
                  aria-hidden
                  title={MEMBERSHIP_COMPARISON.featuredBadge}
                  className="size-2 rounded-full bg-brand-green"
                />
                <span className="sr-only">({MEMBERSHIP_COMPARISON.featuredBadge})</span>
              </>
            )}
          </span>
        ))}
      </div>

      <div id="pilar-panel" role="tabpanel" aria-labelledby={`pilar-tab-${active}`} className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={group.pillar}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="divide-y divide-foreground/[0.06]"
          >
            {group.rows.map((row) => (
              <li
                key={row.label}
                className={cn("grid gap-3 px-3 py-4 text-[15px] md:items-center md:gap-4 md:px-5", GRID)}
              >
                <span className="font-medium">{row.label}</span>
                <div className="grid grid-cols-3 gap-3 md:contents">
                  {row.values.map((value, index) => (
                    <div
                      key={plans[index]}
                      className={cn(
                        "flex flex-col gap-1 text-sm md:items-center md:text-center md:text-[15px]",
                        index === featuredIndex &&
                          "md:-my-4 md:justify-center md:self-stretch md:bg-brand-green/[0.07] md:py-4"
                      )}
                    >
                      <span className="text-xs text-muted-foreground md:hidden">{plans[index]}</span>
                      <Cell value={value} />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  )
}
