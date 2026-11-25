// Secciones de Mi cuenta. Cursos y eventos están ocultos hasta que haya: poner `hidden: false` para
// volver a mostrarlos (el panel ya sabe listarlos).
export const ACCOUNT_SECTIONS = {
  courses: { hidden: true },
  events: { hidden: true },
} as const

// Botón de la tarjeta de membresía: la socia ya se sumó, acá cambia de plan
export const UPGRADE_PLAN_LABEL = "Mejorar plan"
