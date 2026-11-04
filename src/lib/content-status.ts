// Estado de cursos, eventos y publicaciones (enum content_status). Va aparte de los datos porque
// también lo usan componentes de cliente, que no pueden importar código de servidor.
export type ContentStatus = "draft" | "published" | "archived"

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
}
