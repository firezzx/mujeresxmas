import { Suspense } from "react"

import { AvatarCircles } from "@/components/ui/avatar-circles"
import { HOME_HERO } from "@/content/home"
import { getLatestMembers } from "@/lib/members"

const CIRCLE_CLASS = "size-11 rounded-full border-2 border-background"

async function LatestMembersCircles() {
  const members = await getLatestMembers()
  if (!members.length) return null
  return <AvatarCircles members={members} />
}

// Las últimas personas registradas junto al texto de bienvenida. Sin registros, queda solo el texto.
export function LatestMembers() {
  return (
    <div className="flex items-center gap-3">
      <Suspense
        fallback={
          <div aria-hidden className="flex -space-x-3">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`${CIRCLE_CLASS} animate-pulse bg-muted`} />
            ))}
          </div>
        }
      >
        <LatestMembersCircles />
      </Suspense>
      <span className="font-heading text-lg font-medium tracking-[-0.01em]">{HOME_HERO.avatarsText}</span>
    </div>
  )
}
