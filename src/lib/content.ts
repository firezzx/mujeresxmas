import { connection } from "next/server"

import type { ContentStatus } from "@/lib/content-status"
import { createClient } from "@/lib/supabase/server"

// Supabase compara el vencimiento del token con la hora actual: solo puede pasar en el pedido
// real, no en el prerender
async function getClient() {
  await connection()
  return createClient()
}

// Cursos y eventos (supabase/migrations/*_cursos_eventos_notificaciones.sql).
// Para sumar un campo: columna en la migración, una línea en el tipo y en el select.

export type Course = {
  id: string
  title: string
  summary: string | null
  status: ContentStatus
  startsAt: string | null
}

export type CommunityEvent = {
  id: string
  title: string
  summary: string | null
  location: string | null
  onlineUrl: string | null
  status: ContentStatus
  startsAt: string
  endsAt: string | null
}

type CourseRow = { id: string; title: string; summary: string | null; status: ContentStatus; starts_at: string | null }
type EventRow = {
  id: string
  title: string
  summary: string | null
  location: string | null
  online_url: string | null
  status: ContentStatus
  starts_at: string
  ends_at: string | null
}
type CountRow = { count: number }[]

const COURSE_COLUMNS = "id, title, summary, status, starts_at"
const EVENT_COLUMNS = "id, title, summary, location, online_url, status, starts_at, ends_at"

const toCourse = (row: CourseRow): Course => ({
  id: row.id,
  title: row.title,
  summary: row.summary,
  status: row.status,
  startsAt: row.starts_at,
})

const toEvent = (row: EventRow): CommunityEvent => ({
  id: row.id,
  title: row.title,
  summary: row.summary,
  location: row.location,
  onlineUrl: row.online_url,
  status: row.status,
  startsAt: row.starts_at,
  endsAt: row.ends_at,
})

// ─── Usuaria ───────────────────────────────────────────────────────────────────────────

// Cursos en los que está inscripta la usuaria (RLS: solo los suyos y solo publicados)
export async function getMyCourses(userId: string): Promise<Course[]> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("course_enrollments")
    .select(`created_at, courses (${COURSE_COLUMNS})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  if (error) console.error("[getMyCourses]", error.code, error.message)

  // Sin tipos generados, Supabase no sabe que la relación es uno a uno
  return (data ?? []).flatMap((row) => {
    const course = row.courses as unknown as CourseRow | null
    return course ? [toCourse(course)] : []
  })
}

// Próximos eventos a los que se anotó la usuaria
export async function getMyUpcomingEvents(userId: string): Promise<CommunityEvent[]> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("event_registrations")
    .select(`events (${EVENT_COLUMNS})`)
    .eq("user_id", userId)
  if (error) console.error("[getMyUpcomingEvents]", error.code, error.message)

  const now = Date.now()
  return (data ?? [])
    .flatMap((row) => {
      const event = row.events as unknown as EventRow | null
      return event ? [toEvent(event)] : []
    })
    .filter((event) => new Date(event.endsAt ?? event.startsAt).getTime() >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

// ─── Administración ────────────────────────────────────────────────────────────────────

export type AdminCourse = Course & { enrolled: number }
export type AdminEvent = CommunityEvent & { registered: number }

// Todos los cursos (cualquier estado) con la cantidad de inscriptas. RLS: solo administradoras.
export async function listCoursesForAdmin(): Promise<AdminCourse[] | null> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("courses")
    .select(`${COURSE_COLUMNS}, course_enrollments (count)`)
    .order("created_at", { ascending: false })
  if (error) {
    console.error("[listCoursesForAdmin]", error.code, error.message)
    return null
  }
  return (data as (CourseRow & { course_enrollments: CountRow })[]).map((row) => ({
    ...toCourse(row),
    enrolled: row.course_enrollments[0]?.count ?? 0,
  }))
}

export async function listEventsForAdmin(): Promise<AdminEvent[] | null> {
  const supabase = await getClient()
  const { data, error } = await supabase
    .from("events")
    .select(`${EVENT_COLUMNS}, event_registrations (count)`)
    .order("starts_at", { ascending: false })
  if (error) {
    console.error("[listEventsForAdmin]", error.code, error.message)
    return null
  }
  return (data as (EventRow & { event_registrations: CountRow })[]).map((row) => ({
    ...toEvent(row),
    registered: row.event_registrations[0]?.count ?? 0,
  }))
}
