"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"

import { ArrowLeftIcon } from "@/components/icons/arrow-left"
import { BadgeAlertIcon } from "@/components/icons/badge-alert"
import { BellIcon } from "@/components/icons/bell"
import { BookTextIcon } from "@/components/icons/book-text"
import { CalendarDaysIcon } from "@/components/icons/calendar-days"
import { CheckCheckIcon } from "@/components/icons/check-check"
import { CircleCheckIcon } from "@/components/icons/circle-check"
import { EyeIcon } from "@/components/icons/eye"
import { MailCheckIcon } from "@/components/icons/mail-check"
import { SparklesIcon } from "@/components/icons/sparkles"
import { SquarePenIcon } from "@/components/icons/square-pen"
import { UsersRoundIcon } from "@/components/icons/users-round"
import { cn } from "@/lib/utils"

type AnimatedIconHandle = { startAnimation: () => void; stopAnimation: () => void }

// Íconos de Lucide Animated que se usan desde Server Components. Se eligen por nombre porque
// un componente no se puede pasar como prop del servidor al navegador.
const ICONS = {
  "arrow-left": ArrowLeftIcon,
  "badge-alert": BadgeAlertIcon,
  bell: BellIcon,
  "book-text": BookTextIcon,
  "calendar-days": CalendarDaysIcon,
  "check-check": CheckCheckIcon,
  "circle-check": CircleCheckIcon,
  eye: EyeIcon,
  "mail-check": MailCheckIcon,
  sparkles: SparklesIcon,
  "square-pen": SquarePenIcon,
  "users-round": UsersRoundIcon,
}

export type IconName = keyof typeof ICONS

type Registry = Set<React.RefObject<AnimatedIconHandle | null>>
const AreaContext = createContext<Registry | null>(null)

// Zona (tarjeta, botón, link) que anima todos los HoverIcon de adentro al pasar el mouse o
// al recibir foco. Sin zona, cada ícono se anima al pasar sobre él.
export function IconHoverArea({ className, children, ...props }: React.ComponentProps<"div">) {
  // Conjunto estable de íconos registrados (se crea una sola vez)
  const [registry] = useState<Registry>(() => new Set())
  const run = (action: keyof AnimatedIconHandle) => registry.forEach((ref) => ref.current?.[action]())

  return (
    <AreaContext.Provider value={registry}>
      <div
        {...props}
        className={className}
        onMouseEnter={() => run("startAnimation")}
        onMouseLeave={() => run("stopAnimation")}
        onFocus={() => run("startAnimation")}
        onBlur={() => run("stopAnimation")}
      >
        {children}
      </div>
    </AreaContext.Provider>
  )
}

type HoverIconProps = {
  name: IconName
  size?: number
  className?: string
  // Se anima una vez al aparecer (para estados de éxito: correo enviado, cuenta confirmada…)
  autoPlay?: boolean
}

export function HoverIcon({ name, size = 20, className, autoPlay = false }: HoverIconProps) {
  const Icon = ICONS[name]
  const ref = useRef<AnimatedIconHandle>(null)
  const registry = useContext(AreaContext)

  useEffect(() => {
    if (!registry) return
    registry.add(ref)
    return () => {
      registry.delete(ref)
    }
  }, [registry])

  useEffect(() => {
    if (!autoPlay) return
    const timer = setTimeout(() => ref.current?.startAnimation(), 350)
    return () => clearTimeout(timer)
  }, [autoPlay])

  // Dentro de una zona, el ícono no escucha el mouse por su cuenta: lo anima la zona
  return <Icon ref={ref} size={size} className={cn("shrink-0", registry && "pointer-events-none", className)} />
}
