"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

// Link entre login y registro que conserva el ?next= de la página actual, para no perder
// a dónde volver (p. ej. Kiero). Se lee al montar: así la página sigue siendo estática.
export function KeepNextLink({ href, ...props }: React.ComponentProps<typeof Link> & { href: string }) {
  const [target, setTarget] = useState(href)

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next")
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende de la URL del navegador
    if (next) setTarget(`${href}?next=${encodeURIComponent(next)}`)
  }, [href])

  return <Link href={target} {...props} />
}
