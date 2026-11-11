import { cache } from "react"

import { ROUTES } from "@/config/navigation"
import { HOME_COURSES, HOME_EVENTS, HOME_NOTES, HOME_VOICES, SHOW_SAMPLES } from "@/content/home"
import { listPublicPosts } from "@/lib/blog"
import { blogImageUrl } from "@/lib/blog-shared"
import { listPublishedCourses, listUpcomingEvents } from "@/lib/content"
import { formatDateTime } from "@/lib/format"

// Datos reales de la vitrina del inicio (cursos, notas, encuentros y voces), completados con los
// ejemplos de src/content/home.ts solo donde están habilitados (SHOW_SAMPLES).

export const SHOWCASE_SIZE = 3

export type ShowcaseCard = {
  key: string
  title: string
  text: string | null
  meta: string
  image: string | null
  imageAlt: string
  href: string
  sample: boolean
}

export type ShowcaseEvent = { key: string; title: string; meta: string; startsAt: string; sample: boolean }

export type ShowcaseVoice = (typeof HOME_VOICES.samples)[number]

const withSamples = <T>(real: T[], samples: T[]) =>
  (SHOW_SAMPLES ? [...real, ...samples] : real).slice(0, SHOWCASE_SIZE)

export const getShowcase = cache(async () => {
  const [courses, listing, events] = await Promise.all([
    listPublishedCourses(SHOWCASE_SIZE),
    listPublicPosts(null, 1),
    listUpcomingEvents(SHOWCASE_SIZE),
  ])
  const posts = listing ? [...(listing.featured ? [listing.featured] : []), ...listing.posts] : []

  return {
    courses: withSamples<ShowcaseCard>(
      courses.map((course) => ({
        key: course.id,
        title: course.title,
        text: course.summary,
        meta: course.startsAt ? `Empieza ${formatDateTime(course.startsAt)}` : "Curso online",
        image: null,
        imageAlt: "",
        href: ROUTES.registro,
        sample: false,
      })),
      HOME_COURSES.samples.map((item) => ({
        ...item,
        key: item.title,
        imageAlt: "",
        href: ROUTES.registro,
        sample: true,
      }))
    ),
    notes: withSamples<ShowcaseCard>(
      posts.map((post) => ({
        key: post.id,
        title: post.title,
        text: post.excerpt,
        meta: `${post.readingMinutes} min de lectura`,
        image: post.coverPath && blogImageUrl(post.coverPath),
        imageAlt: post.coverAlt ?? "",
        href: `${ROUTES.blog}/${post.slug}`,
        sample: false,
      })),
      HOME_NOTES.samples.map((item) => ({ ...item, key: item.title, imageAlt: "", href: ROUTES.blog, sample: true }))
    ),
    events: withSamples<ShowcaseEvent>(
      events.map((event) => ({
        key: event.id,
        title: event.title,
        meta: [event.location, event.onlineUrl && "Online"].filter(Boolean).join(" · "),
        startsAt: event.startsAt,
        sample: false,
      })),
      HOME_EVENTS.samples.map((item) => ({ ...item, key: item.title, sample: true }))
    ),
    voices: SHOW_SAMPLES ? HOME_VOICES.samples : [],
  }
})
