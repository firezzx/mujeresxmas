import type { MetadataRoute } from "next"

import { ROUTES } from "@/config/navigation"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [ROUTES.admin, ROUTES.miCuenta] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
