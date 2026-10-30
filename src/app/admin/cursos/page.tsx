import type { Metadata } from "next"
import { Suspense } from "react"

import {
  AdminEmpty,
  AdminList,
  AdminLoadError,
  AdminRow,
  AdminSection,
  AdminSectionSkeleton,
  ComingSoonButton,
  StatusBadge,
} from "@/components/admin/admin-ui"
import { listCoursesForAdmin } from "@/lib/content"
import { formatDay } from "@/lib/format"

export const metadata: Metadata = {
  title: "Cursos · Administración",
  robots: { index: false },
}

// Sección Cursos. La base ya está lista (tabla courses e inscripciones); falta el formulario
// de carga, que se suma cuando la clienta defina qué datos lleva cada curso.
export default function AdminCoursesPage() {
  return (
    <AdminSection
      title="Cursos"
      description="Los cursos de la comunidad y cuántas usuarias se inscribieron en cada uno."
      action={<ComingSoonButton icon="book-text">Nuevo curso</ComingSoonButton>}
    >
      <Suspense fallback={<AdminSectionSkeleton />}>
        <CoursesList />
      </Suspense>
    </AdminSection>
  )
}

async function CoursesList() {
  const courses = await listCoursesForAdmin()
  if (!courses) return <AdminLoadError />
  if (!courses.length) {
    return (
      <AdminEmpty
        icon="book-text"
        title="Todavía no hay cursos"
        text="Muy pronto vas a poder crearlos desde acá. Cuando una usuaria se inscriba, lo vas a ver en su panel."
      />
    )
  }

  return (
    <AdminList>
      {courses.map((course) => (
        <AdminRow
          key={course.id}
          title={course.title}
          detail={course.summary}
          aside={
            <>
              {course.startsAt && <span>Empieza el {formatDay(course.startsAt)}</span>}
              <span>
                {course.enrolled} {course.enrolled === 1 ? "inscripta" : "inscriptas"}
              </span>
              <StatusBadge status={course.status} />
            </>
          }
        />
      ))}
    </AdminList>
  )
}
