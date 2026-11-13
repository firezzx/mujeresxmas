"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, type IconName } from "@/components/icons/hover-icon"
import { HOME_PRODUCT } from "@/content/home"
import { cn } from "@/lib/utils"

const ease = [0.16, 1, 0.3, 1] as const // curva de entrada

const TABS: IconName[] = ["layout-panel-top", "search", "chart-line", "users-round"]

// Marco de celular con barra de estado y barra de pestañas de la app abajo
function Phone({ active, className, children }: { active: number; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[2.2rem] bg-foreground p-2 shadow-[0_50px_90px_-30px_rgb(26_26_26/0.55)] ring-1 ring-foreground/10",
        className
      )}
    >
      <div className="relative flex aspect-[9/19] flex-col overflow-hidden rounded-[1.7rem] bg-background">
        <div className="flex items-center justify-between px-5 pt-2.5 pb-1.5 text-[0.625rem] font-semibold">
          9:41
          <span className="absolute top-2 left-1/2 h-4 w-14 -translate-x-1/2 rounded-full bg-foreground" />
          <span className="flex items-end gap-0.5">
            <span className="h-1 w-0.5 rounded-sm bg-foreground" />
            <span className="h-1.5 w-0.5 rounded-sm bg-foreground" />
            <span className="h-2 w-0.5 rounded-sm bg-foreground" />
            <span className="ml-1 h-2 w-4 rounded-[3px] border border-foreground/70" />
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-3.5">{children}</div>
        <div className="flex items-center justify-around border-t border-foreground/[0.07] px-3 pt-2 pb-3">
          {TABS.map((tab, index) => (
            <span
              key={tab}
              className={cn(
                "flex size-7 items-center justify-center rounded-lg",
                index === active ? "bg-brand-green/18 text-brand-green-strong" : "text-foreground/35"
              )}
            >
              <HoverIcon name={tab} size={14} />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Pantalla principal de la app: la tienda con portada, categorías y productos
function StoreScreen() {
  const { store } = HOME_PRODUCT.home.app
  return (
    <>
      <div className="flex items-center justify-between py-2">
        <div className="flex flex-col">
          <span className="text-[0.625rem] text-muted-foreground">{store.greeting}</span>
          <span className="font-heading text-base leading-tight font-bold tracking-[-0.01em]">{store.name}</span>
        </div>
        <span className="flex size-7 items-center justify-center rounded-full bg-brand-soft font-heading text-[0.625rem] font-bold">
          TM
        </span>
      </div>
      <div className="relative h-[5.5rem] shrink-0 overflow-hidden rounded-lg">
        <Image src={HOME_PRODUCT.image} alt="" fill sizes="16rem" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/85 via-primary/40 to-transparent" />
        <div className="absolute inset-y-0 right-3 flex flex-col items-end justify-center gap-1 text-right text-white">
          <span className="font-hand text-base leading-none text-brand-soft">{store.banner}</span>
          <span className="rounded-md bg-white px-2 py-0.5 text-[0.5625rem] font-semibold text-foreground">
            Ver todo
          </span>
        </div>
      </div>
      <div className="flex gap-1.5 py-2.5">
        {store.categories.map((category, index) => (
          <span
            key={category}
            className={cn(
              "rounded-md px-2 py-1 text-[0.5625rem] font-semibold",
              index === 0 ? "bg-brand-green text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            {category}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {store.products.map((product) => (
          <div key={product.name} className="flex min-w-0 flex-col gap-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
              <Image src={product.image} alt="" fill sizes="8rem" className="object-cover" />
              <span className="absolute right-1 bottom-1 flex size-4 items-center justify-center rounded-[5px] bg-background text-[0.625rem] leading-none font-bold">
                +
              </span>
            </div>
            <span className="truncate text-[0.5625rem] leading-tight font-medium">{product.name}</span>
            <span className="font-heading text-[0.625rem] leading-none font-semibold text-brand-green-strong">
              {product.price}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

// Segunda pantalla: las ventas del día, con gráfico y pedidos
function SalesScreen() {
  const { sales } = HOME_PRODUCT.home.app
  const last = sales.bars.length - 1
  return (
    <>
      <span className="pt-2 text-[0.625rem] text-muted-foreground">{sales.title}</span>
      <div className="flex items-center gap-2">
        <span className="font-heading text-2xl leading-tight font-bold tracking-[-0.02em]">{sales.total}</span>
        <span className="rounded-md bg-brand-green/18 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-brand-green-strong">
          {sales.change}
        </span>
      </div>
      <div className="mt-3 flex h-20 shrink-0 items-end gap-1.5 rounded-lg bg-muted/60 p-2">
        {sales.bars.map((bar, index) => (
          <span
            key={index}
            style={{ height: `${bar}%` }}
            className={cn("flex-1 rounded-sm", index === last ? "bg-brand" : "bg-brand-green/60")}
          />
        ))}
      </div>
      <span className="mt-3 mb-1.5 font-heading text-[0.6875rem] font-semibold">Pedidos</span>
      <ul className="flex flex-col gap-1.5">
        {sales.orders.map((order) => (
          <li key={order.name} className="flex items-center gap-2 rounded-lg bg-muted/60 p-1.5">
            <span className="relative size-7 shrink-0 overflow-hidden rounded-md">
              <Image src={order.image} alt="" fill sizes="2rem" className="object-cover" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[0.5625rem] font-medium">{order.name}</span>
              <span className="text-[0.5625rem] text-muted-foreground">{order.price}</span>
            </span>
            <span className="rounded-[5px] bg-brand-green/18 px-1.5 py-0.5 text-[0.5rem] font-semibold text-brand-green-strong">
              {sales.status}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

// Maqueta ilustrativa de la app de Kiero: la tienda en un celular adelante, las ventas del día en otro
// detrás, el aviso de una venta nueva y el link para compartir en redes. Entra en escena por partes.
export function KieroStoreMockup() {
  const { note, push, share } = HOME_PRODUCT.home.app
  const reduce = useReducedMotion() ?? false
  const enter = (delay: number, from: Record<string, number>) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, ...from },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.1, delay, ease },
  })

  return (
    <div aria-hidden className="relative mx-auto h-[30rem] w-full max-w-xl sm:h-[36rem]">
      {/* Resplandores de marca detrás */}
      <div className="absolute inset-x-[12%] top-[12%] bottom-[12%] -z-10 rounded-full bg-brand-green/35 blur-[80px]" />
      <div className="absolute right-0 bottom-0 -z-10 size-56 rounded-full bg-brand-soft/60 blur-[80px]" />

      <motion.p
        {...enter(0.9, { y: 8 })}
        className="absolute top-0 left-[2%] hidden font-hand text-2xl leading-none font-semibold text-brand-green-strong sm:block sm:text-3xl"
      >
        {note}
      </motion.p>

      {/* Ventas, detrás */}
      <motion.div {...enter(0.15, { x: -30, y: 30 })} className="absolute top-[15%] left-[2%] sm:left-[6%]">
        <Phone active={2} className="w-[10.5rem] -rotate-[7deg] sm:w-[13rem]">
          <SalesScreen />
        </Phone>
      </motion.div>

      {/* Tienda, adelante */}
      <motion.div {...enter(0, { y: 50 })} className="absolute top-[10%] right-[4%] sm:right-[10%]">
        <Phone active={0} className="w-[12rem] rotate-[3deg] sm:w-[15rem]">
          <StoreScreen />
        </Phone>
      </motion.div>

      {/* Aviso de venta nueva */}
      <motion.div
        {...enter(1.2, { y: -14, scale: 0.85 })}
        className="absolute top-[2%] right-0 z-10 w-[13.5rem] sm:-right-4 sm:w-[15rem]"
      >
        <div className="flex items-center gap-3 rounded-xl bg-background/90 p-2.5 shadow-[0_24px_48px_-20px_rgb(26_26_26/0.45)] ring-1 ring-foreground/[0.06] backdrop-blur-md motion-safe:animate-float">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-green font-heading text-base font-bold text-primary">
            K
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="flex justify-between text-[0.625rem] text-muted-foreground">
              {push.app}
              <span>{push.time}</span>
            </span>
            <span className="font-heading text-sm leading-tight font-semibold">{push.title}</span>
            <span className="truncate text-xs text-muted-foreground">{push.text}</span>
          </div>
        </div>
      </motion.div>

      {/* Link para compartir en redes */}
      <motion.div {...enter(1.45, { y: 14 })} className="absolute bottom-[3%] left-0 z-10 sm:bottom-[6%]">
        <div className="flex max-w-[15rem] items-center gap-3 rounded-xl bg-background p-3 shadow-[0_24px_48px_-20px_rgb(26_26_26/0.4)] ring-1 ring-foreground/[0.06] motion-safe:animate-float [animation-delay:1.5s]">
          <IconBadge tone="pink" size="sm">
            <HoverIcon name="link" size={16} />
          </IconBadge>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-semibold">{share.title}</span>
            <span className="text-xs leading-snug text-muted-foreground">{share.text}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
