// Beneficios de los planes. Una línea que empieza con "*" se muestra destacada (en negrita y con el
// punto naranja); así se marca desde el panel sin columnas extra. Ej.: "* Kiero, plataforma de e-commerce".
export const HIGHLIGHT_MARK = "*"

export type PlanFeature = { text: string; highlighted: boolean }

export function parsePlanFeature(line: string): PlanFeature {
  const trimmed = line.trim()
  if (trimmed.startsWith(HIGHLIGHT_MARK)) {
    return { text: trimmed.slice(HIGHLIGHT_MARK.length).trim(), highlighted: true }
  }
  return { text: trimmed, highlighted: false }
}
