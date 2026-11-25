// Secciones de Mi cuenta. Cursos y eventos están ocultos hasta que haya: poner `hidden: false` para
// volver a mostrarlos (el panel ya sabe listarlos).
export const ACCOUNT_SECTIONS = {
  courses: { hidden: true },
  events: { hidden: true },
} as const

export const ACCOUNT_INTRO = {
  eyebrow: "Mi cuenta",
  // Se arma según las secciones visibles
  description: (parts: string[]) => `Acá están ${parts.join(", ").replace(/, ([^,]*)$/, " y $1")}.`,
}
