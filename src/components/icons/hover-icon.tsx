"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"

import { ArrowLeftIcon } from "@/components/icons/arrow-left"
import { ArrowRightIcon } from "@/components/icons/arrow-right"
import { BadgeAlertIcon } from "@/components/icons/badge-alert"
import { BellIcon } from "@/components/icons/bell"
import { BoldIcon } from "@/components/icons/bold"
import { BookTextIcon } from "@/components/icons/book-text"
import { CalendarDaysIcon } from "@/components/icons/calendar-days"
import { ChartLineIcon } from "@/components/icons/chart-line"
import { CheckCheckIcon } from "@/components/icons/check-check"
import { CircleCheckIcon } from "@/components/icons/circle-check"
import { CompassIcon } from "@/components/icons/compass"
import { CpuIcon } from "@/components/icons/cpu"
import { EyeIcon } from "@/components/icons/eye"
import { FileTextIcon } from "@/components/icons/file-text"
import { GraduationCapIcon } from "@/components/icons/graduation-cap"
import { ItalicIcon } from "@/components/icons/italic"
import { LinkIcon } from "@/components/icons/link"
import { LinkedinIcon } from "@/components/icons/linkedin"
import { MailCheckIcon } from "@/components/icons/mail-check"
import { MessageCircleIcon } from "@/components/icons/message-circle"
import { PlusIcon } from "@/components/icons/plus"
import { RedoIcon } from "@/components/icons/redo"
import { RocketIcon } from "@/components/icons/rocket"
import { SearchIcon } from "@/components/icons/search"
import { SparklesIcon } from "@/components/icons/sparkles"
import { SquarePenIcon } from "@/components/icons/square-pen"
import { TrendingUpIcon } from "@/components/icons/trending-up"
import { UnderlineIcon } from "@/components/icons/underline"
import { UndoIcon } from "@/components/icons/undo"
import { UploadIcon } from "@/components/icons/upload"
import { UsersRoundIcon } from "@/components/icons/users-round"
import { WalletIcon } from "@/components/icons/wallet"
import { XIcon } from "@/components/icons/x"
import { cn } from "@/lib/utils"

type AnimatedIconHandle = { startAnimation: () => void; stopAnimation: () => void }

// Íconos de Lucide Animated que se usan desde Server Components. Se eligen por nombre porque
// un componente no se puede pasar como prop del servidor al navegador.
const ICONS = {
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "badge-alert": BadgeAlertIcon,
  bell: BellIcon,
  bold: BoldIcon,
  "book-text": BookTextIcon,
  "calendar-days": CalendarDaysIcon,
  "chart-line": ChartLineIcon,
  "check-check": CheckCheckIcon,
  "circle-check": CircleCheckIcon,
  compass: CompassIcon,
  cpu: CpuIcon,
  eye: EyeIcon,
  "file-text": FileTextIcon,
  "graduation-cap": GraduationCapIcon,
  italic: ItalicIcon,
  link: LinkIcon,
  linkedin: LinkedinIcon,
  "mail-check": MailCheckIcon,
  "message-circle": MessageCircleIcon,
  plus: PlusIcon,
  redo: RedoIcon,
  rocket: RocketIcon,
  search: SearchIcon,
  sparkles: SparklesIcon,
  "square-pen": SquarePenIcon,
  "trending-up": TrendingUpIcon,
  underline: UnderlineIcon,
  undo: UndoIcon,
  upload: UploadIcon,
  "users-round": UsersRoundIcon,
  wallet: WalletIcon,
  x: XIcon,
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
