"use client"

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react"
import { useRef } from "react"

import { CountUp } from "@/components/count-up"
import { HOME_IMPACT } from "@/content/home"
import { COMMUNITY_PORTRAITS } from "@/content/retratos"
import { cn } from "@/lib/utils"

type Accent = "green" | "pink" | "orange"

// Tres planos de profundidad. Lejos: más chicos, apenas desenfocados, se mueven poco y despacio.
// Cerca: más grandes, nítidos, con sombra profunda; al bajar con el scroll se desplazan más rápido.
type Layer = "far" | "mid" | "near"

const LAYERS: Record<Layer, { scroll: number; blur: number; sway: number; shadow: string; z: number }> = {
  far: { scroll: -70, blur: 1.2, sway: 2.5, shadow: "0 18px 36px -22px rgb(26 26 26 / 0.35)", z: 0 },
  mid: { scroll: -150, blur: 0, sway: 4, shadow: "0 26px 52px -26px rgb(26 26 26 / 0.45)", z: 10 },
  near: { scroll: -260, blur: 0, sway: 6, shadow: "0 40px 80px -32px rgb(26 26 26 / 0.55)", z: 20 },
}

// Retratos a los costados de la portada: posición en % de la sección, tamaño en rem, giro en
// grados, plano de profundidad y ritmo propio de flotación. Algunos llevan un bloque de color de
// marca detrás o el nombre de un pilar.
const TILES: {
  side: "left" | "right"
  top: number
  inset: number
  size: number
  rotate: number
  layer: Layer
  duration: number
  accent?: Accent
  chip?: { label: string; tone: Accent }
}[] = [
  { side: "left", top: 14, inset: 11, size: 6, rotate: -6, layer: "far", duration: 9 },
  {
    side: "left",
    top: 30,
    inset: 2,
    size: 9.5,
    rotate: 3,
    layer: "near",
    duration: 7,
    accent: "green",
    chip: { label: "Desarrollo", tone: "green" },
  },
  { side: "left", top: 55, inset: 13, size: 7, rotate: -3, layer: "mid", duration: 8, accent: "orange" },
  { side: "left", top: 71, inset: 4, size: 6.5, rotate: 5, layer: "far", duration: 9 },
  { side: "right", top: 12, inset: 3, size: 8.5, rotate: 5, layer: "mid", duration: 8, accent: "pink" },
  {
    side: "right",
    top: 35,
    inset: 13,
    size: 6.5,
    rotate: -4,
    layer: "mid",
    duration: 9.5,
    chip: { label: "Bienestar", tone: "pink" },
  },
  { side: "right", top: 50, inset: 2, size: 9.5, rotate: 3, layer: "near", duration: 7.5, accent: "green" },
  {
    side: "right",
    top: 67,
    inset: 11,
    size: 7,
    rotate: -5,
    layer: "mid",
    duration: 8.2,
    chip: { label: "Conexión", tone: "orange" },
  },
]

const ACCENT_CLASS: Record<Accent, string> = {
  green: "bg-brand-green/45",
  pink: "bg-brand-soft/80",
  orange: "bg-brand/25",
}

const CHIP_CLASS: Record<Accent, string> = {
  green: "bg-brand-green",
  pink: "bg-brand-soft",
  orange: "bg-brand",
}

const ease = [0.16, 1, 0.3, 1] as const

export function PortraitTile({
  src,
  className,
  style,
}: {
  src: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative overflow-hidden rounded-xl bg-muted shadow-[0_24px_48px_-24px_rgb(26_26_26/0.45)] ring-4 ring-white",
        className
      )}
    >
      <Image src={src} alt="" fill sizes="10rem" className="object-cover" />
    </div>
  )
}

// Cifra en una tarjeta de vidrio claro, entre los retratos
function FloatingStat({ stat, delay }: { stat: (typeof HOME_IMPACT.stats)[number]; delay: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-background/85 py-3 pr-5 pl-3 text-left shadow-[0_24px_48px_-24px_rgb(26_26_26/0.35)] ring-1 ring-foreground/[0.08] backdrop-blur-md">
      <span aria-hidden className="h-10 w-1 rounded-sm bg-brand-green" />
      <div className="flex flex-col gap-1">
        <span className="font-heading text-3xl leading-none font-semibold tracking-[-0.025em] text-foreground">
          {stat.prefix}
          <CountUp value={stat.value} delay={delay} className="tabular-nums" />
        </span>
        <span className="text-sm text-muted-foreground">{stat.label}</span>
      </div>
    </div>
  )
}

// Un elemento con profundidad: entra desde el fondo (más chico, inclinado y desenfocado), se mece
// en 3D en reposo y, al bajar, se desplaza según su plano.
function DepthItem({
  progress,
  layer,
  index,
  duration,
  rotate,
  reduceMotion,
  className,
  style,
  children,
}: {
  progress: MotionValue<number>
  layer: Layer
  index: number
  duration: number
  rotate: number
  reduceMotion: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const config = LAYERS[layer]
  const y = useTransform(progress, [0, 1], [0, reduceMotion ? 0 : config.scroll])
  const opacity = useTransform(progress, [0, 0.85], [1, reduceMotion ? 1 : 0.15])
  const fromLeft = (style?.left ?? "") !== ""
  const blur = `blur(${config.blur}px)`

  return (
    <motion.div className={cn("absolute", className)} style={{ ...style, y, opacity, zIndex: config.z }}>
      <motion.div
        initial={
          reduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 0.55,
                rotateY: fromLeft ? 35 : -35,
                rotateX: 12,
                z: -300,
                filter: "blur(14px)",
              }
        }
        animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0, z: 0, filter: blur }}
        transition={{ duration: 1.4, delay: 0.3 + index * 0.09, ease }}
        style={{ rotate: `${rotate}deg`, transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -config.sway * 2, 0],
                  rotateX: [0, config.sway, 0],
                  rotateY: [0, fromLeft ? -config.sway : config.sway, 0],
                }
          }
          transition={{ duration, delay: 1.6 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Capa de escritorio: retratos en tres planos de profundidad y dos cifras, con perspectiva
export function HeroFloaters() {
  const reduceMotion = useReducedMotion() ?? false
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
      style={{ perspective: "1200px" }}
    >
      {TILES.map((tile, index) => (
        <DepthItem
          key={index}
          progress={progress}
          layer={tile.layer}
          index={index}
          duration={tile.duration}
          rotate={tile.rotate}
          reduceMotion={reduceMotion}
          style={{ top: `${tile.top}%`, [tile.side]: `${tile.inset}%` }}
        >
          <div className="relative">
            {tile.accent && (
              <span
                className={cn(
                  "absolute inset-0 rounded-xl",
                  tile.side === "left" ? "-translate-x-3 translate-y-3" : "translate-x-3 translate-y-3",
                  ACCENT_CLASS[tile.accent]
                )}
              />
            )}
            <PortraitTile
              src={COMMUNITY_PORTRAITS[index]}
              style={{ width: `${tile.size}rem`, height: `${tile.size}rem`, boxShadow: LAYERS[tile.layer].shadow }}
            />
            {tile.chip && (
              <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-md bg-background px-2.5 py-1 font-heading text-xs font-semibold whitespace-nowrap shadow-[0_8px_20px_-10px_rgb(26_26_26/0.4)] ring-1 ring-foreground/[0.08]">
                <span className={cn("size-1.5 rounded-full", CHIP_CLASS[tile.chip.tone])} />
                {tile.chip.label}
              </span>
            )}
          </div>
        </DepthItem>
      ))}
      <DepthItem
        progress={progress}
        layer="near"
        index={TILES.length}
        duration={9}
        rotate={0}
        reduceMotion={reduceMotion}
        className="bottom-[4%]"
        style={{ left: "14%" }}
      >
        <FloatingStat stat={HOME_IMPACT.stats[1]} delay={1.4} />
      </DepthItem>
      <DepthItem
        progress={progress}
        layer="near"
        index={TILES.length + 1}
        duration={8}
        rotate={0}
        reduceMotion={reduceMotion}
        className="bottom-[3%]"
        style={{ right: "3%" }}
      >
        <FloatingStat stat={HOME_IMPACT.stats[2]} delay={1.5} />
      </DepthItem>
    </div>
  )
}
