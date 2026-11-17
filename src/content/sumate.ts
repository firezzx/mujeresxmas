// Página de registro única (/sumate): nombre y apellido, email y país para sumarse a la lista de
// correos de la comunidad. Se comparte por link: no está en el menú y no muestra header ni footer.

export const SIGNUP_PAGE = {
  // Origen guardado en cada registro (columna material de material_leads)
  source: "sumate",
  eyebrow: "Comunidad Mujeres x Más",
  title: "Sumate a la",
  titleHighlight: "comunidad",
  description:
    "Dejanos tus datos y recibí las novedades, encuentros y oportunidades para emprendedoras de Argentina y la región.",
  bullets: ["Novedades de la comunidad", "Encuentros y talleres", "Oportunidades para tu emprendimiento"],
  hand: "ninguna camina sola",
  formTitle: "Completá tus datos",
  submit: "Sumarme",
  consent: "Al sumarte aceptás recibir correos de Mujeres x Más. Podés darte de baja cuando quieras.",
  sentTitle: "¡Muchas gracias por sumarte!",
  sentText: "Te mandamos un correo de bienvenida. Si no lo ves, revisá la carpeta de spam o promociones.",
  metaDescription: "Sumate a la comunidad Mujeres x Más y recibí novedades, encuentros y oportunidades.",
} as const

// Correo de agradecimiento que llega al registrarse
export const THANK_YOU_EMAIL = {
  subject: "¡Muchas gracias por sumarte, {nombre}!",
  title: "¡Muchas gracias, {nombre}!",
  paragraphs: [
    "Qué alegría que te sumes a Mujeres x Más, la comunidad de emprendedoras que se acompañan para vender más, ordenar sus números y crecer.",
    "Desde ahora vas a recibir nuestras novedades, encuentros y oportunidades para tu emprendimiento.",
  ],
  cta: "Conocé la comunidad",
  signature: "Con cariño,\nel equipo de Mujeres x Más",
  hashtag: "#CrecemosJuntas",
} as const

// Países del formulario: Argentina y Paraguay primero, después la región.
export const COUNTRIES = [
  "Argentina",
  "Paraguay",
  "Uruguay",
  "Chile",
  "Bolivia",
  "Brasil",
  "Perú",
  "Colombia",
  "Ecuador",
  "Venezuela",
  "México",
  "España",
  "Otro país",
] as const

// Página de baja de los correos masivos (/baja)
export const UNSUBSCRIBE_PAGE = {
  confirmTitle: "¿Querés dejar de recibir nuestros correos?",
  confirmText: "Vas a dejar de recibir las novedades de Mujeres x Más. Podés volver a sumarte cuando quieras.",
  confirm: "Darme de baja",
  doneTitle: "Listo, ya no vas a recibir nuestros correos",
  doneText: "Te dimos de baja. Si fue un error, podés volver a registrarte cuando quieras.",
  invalidTitle: "Este link no es válido",
  invalidText: "Puede que ya te hayas dado de baja o que el link esté incompleto.",
} as const

// Destinatarias de un correo masivo: todas las suscriptas o solo las de un país
export const ALL_AUDIENCE = "todas"
