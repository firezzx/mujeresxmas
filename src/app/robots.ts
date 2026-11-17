import type { MetadataRoute } from "next"

import { ROUTES } from "@/config/navigation"
import { REGISTRATION_ONLY } from "@/config/site-mode"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    // En modo solo registro, los buscadores solo indexan la página de registro
    rules: REGISTRATION_ONLY
      ? { userAgent: "*", allow: ROUTES.sumate, disallow: "/" }
      : { userAgent: "*", allow: "/", disallow: [ROUTES.admin, ROUTES.miCuenta] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
