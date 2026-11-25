import fs from "node:fs"
import path from "node:path"

import { createJiti } from "jiti"

// Genera las plantillas de Supabase Auth (supabase/templates) con el mismo diseño que los correos
// del sitio. Se corre desde la raíz con `npm run correos` y después se pegan en Supabase →
// Authentication → Emails → Templates.
// Con `npm run correos -- --vista-previa <carpeta>` además arma una página con todos los correos.

const jiti = createJiti(import.meta.url, { alias: { "@": path.resolve("src") } })
const templates = await jiti.import("../src/lib/email-templates.ts")
const { AUTH_EMAILS, TEAM_NOTICES, WELCOME_EMAIL } = await jiti.import("../src/content/correos.ts")
const { THANK_YOU_EMAIL } = await jiti.import("../src/content/sumate.ts")

// Variables de Supabase: el link de confirmación suma el token a la URL de vuelta que arma el sitio
// (ya trae "?next="), y el de recuperación arma la URL completa con la del sitio.
const SUPABASE = {
  siteUrl: "{{ .SiteURL }}",
  confirmation: "{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email",
  recovery: "{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/ingresar/nueva-contrasena",
}

const auth = {
  "confirmacion.html": templates.authEmailTemplate({
    copy: AUTH_EMAILS.confirmation,
    siteUrl: SUPABASE.siteUrl,
    link: SUPABASE.confirmation,
  }),
  "recuperacion.html": templates.authEmailTemplate({
    copy: AUTH_EMAILS.recovery,
    siteUrl: SUPABASE.siteUrl,
    link: SUPABASE.recovery,
  }),
}
for (const [file, html] of Object.entries(auth)) {
  fs.writeFileSync(path.join("supabase/templates", file), `${html}\n`)
  console.log(`supabase/templates/${file}`)
}

const previewIndex = process.argv.indexOf("--vista-previa")
if (previewIndex !== -1) {
  const outDir = process.argv[previewIndex + 1]
  if (!outDir) throw new Error("Falta la carpeta: npm run correos -- --vista-previa <carpeta>")
  const siteUrl = "https://mujeresxmas.vercel.app"
  const example = (html) => html.replaceAll("{{ .SiteURL }}", siteUrl).replace(/\{\{[^}]+\}\}/g, "")

  const notice = (key, rows, panelPath) =>
    templates.adminNoticeEmail({ ...TEAM_NOTICES[key], rows, siteUrl, panelPath })

  const emails = [
    [
      "Agradecimiento de /sumate",
      "Usuaria",
      THANK_YOU_EMAIL.subject.replace("{nombre}", "Lucía"),
      templates.thankYouEmail({
        copy: THANK_YOU_EMAIL,
        fullName: "Lucía Gómez",
        siteUrl,
        unsubscribeUrl: `${siteUrl}/baja`,
      }).html,
    ],
    ["Confirmación de cuenta", "Usuaria", "Confirmá tu cuenta en Mujeres x Más", example(auth["confirmacion.html"])],
    [
      "Bienvenida al confirmar",
      "Usuaria",
      WELCOME_EMAIL.subject,
      templates.welcomeEmail({ copy: WELCOME_EMAIL, siteUrl, accountPath: "/mi-cuenta" }).html,
    ],
    [
      "Recuperar contraseña",
      "Usuaria",
      "Elegí una contraseña nueva para Mujeres x Más",
      example(auth["recuperacion.html"]),
    ],
    [
      "Correo masivo del panel",
      "Usuaria",
      "Encuentro de diciembre",
      templates.campaignEmail({
        subject: "Encuentro de diciembre",
        body: "Hola Lucía,\n\nEl jueves 12 hacemos el último encuentro del año y nos encantaría verte.\n\nAnotate acá: https://mujeresxmas.vercel.app",
        siteUrl,
        unsubscribeUrl: `${siteUrl}/baja`,
      }).html,
    ],
    [
      "Aviso: registro en /sumate",
      "Admin",
      TEAM_NOTICES.signup.subject.replace("{nombre}", "Lucía Gómez"),
      notice(
        "signup",
        [
          ["Nombre", "Lucía Gómez"],
          ["Email", "lucia@ejemplo.com"],
          ["País", "Argentina"],
        ],
        "/admin/contactos"
      ).html,
    ],
    [
      "Aviso: pedido de empresa",
      "Admin",
      TEAM_NOTICES.company.subject.replace("{empresa}", "Acme SA"),
      notice(
        "company",
        [
          ["Empresa", "Acme SA"],
          ["Contacto", "Paula Ruiz"],
          ["Email", "paula@acme.com"],
          ["Quiere impulsar a", "Sus colaboradoras"],
        ],
        "/admin/empresas"
      ).html,
    ],
    [
      "Aviso: cuenta nueva",
      "Admin",
      TEAM_NOTICES.account.subject.replace("{email}", "lucia@ejemplo.com"),
      notice(
        "account",
        [
          ["Email", "lucia@ejemplo.com"],
          ["Creada", "25/11/26, 15:30"],
        ],
        "/admin"
      ).html,
    ],
  ]

  fs.mkdirSync(outDir, { recursive: true })
  const cards = emails
    .map(([name, to, subject, html], index) => {
      fs.writeFileSync(path.join(outDir, `${index + 1}.html`), html)
      return `<section><header><span class="to ${to === "Admin" ? "admin" : ""}">Llega a: ${to}</span><h2>${index + 1}. ${name}</h2><p>Asunto: <strong>${templates.escapeHtml(subject)}</strong></p></header><iframe src="${index + 1}.html" loading="lazy"></iframe></section>`
    })
    .join("\n")
  fs.writeFileSync(
    path.join(outDir, "index.html"),
    `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Correos de Mujeres x Más</title>
<style>body{margin:0;font-family:system-ui,sans-serif;background:#f4f4f4;color:#1a1a1a}main{max-width:1240px;margin:0 auto;padding:32px 16px;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,600px),1fr));gap:24px}h1{max-width:1240px;margin:32px auto 0;padding:0 16px;font-size:24px}section{background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5}header{padding:16px 20px;border-bottom:1px solid #eee}h2{margin:6px 0 4px;font-size:17px}p{margin:0;font-size:13px;color:#555}.to{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:#2f7a5b}.to.admin{color:#c0392b}iframe{width:100%;height:880px;border:0;display:block}</style></head>
<body><h1>Correos de Mujeres x Más · nuevo diseño</h1><main>${cards}</main></body></html>`
  )
  console.log(`Vista previa: ${path.join(outDir, "index.html")}`)
}
