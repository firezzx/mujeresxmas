import Image from "next/image"

import type { LatestMember } from "@/lib/members"
import { cn } from "@/lib/utils"

const CIRCLE_CLASS = "size-11 rounded-full border-2 border-background"

// Avatar Circles de Magic UI, adaptado: fotos optimizadas o iniciales si no hay foto, y sin links ni
// contador, porque acá solo acompañan al texto de al lado.
export function AvatarCircles({ members, className }: { members: LatestMember[]; className?: string }) {
  return (
    <div aria-hidden className={cn("flex -space-x-3", className)}>
      {members.map((member, index) =>
        member.avatarUrl ? (
          <Image
            key={index}
            src={member.avatarUrl}
            alt=""
            width={44}
            height={44}
            className={cn(CIRCLE_CLASS, "object-cover")}
          />
        ) : (
          <span
            key={index}
            className={cn(CIRCLE_CLASS, "flex items-center justify-center bg-brand-soft text-sm font-medium")}
          >
            {member.initials}
          </span>
        )
      )}
    </div>
  )
}
