import { BRAND_HEX } from "../config/brand-effects"

// Diseño de todos los correos del sitio y de las plantillas de Supabase Auth (las genera
// `npm run correos`). Va en tablas con estilos en línea porque los clientes de correo no leen CSS
// externo ni las variables del sitio. Import relativo para que el script lo pueda leer sin Next.

// Tonos propios del correo (grises de texto y un verde muy suave para las tablas de datos)
const EMAIL = {
  text: "#3A3A3A",
  muted: "#6B6B6B",
  rule: "#EEEEEE",
  footerText: "#BDBDBD",
  greenTint: "#EEF6F2",
}

const FONT_TITLE = "'Saira',Arial,Helvetica,sans-serif"
const FONT_BODY = "'Jost',Helvetica,Arial,sans-serif"
const FONT_HAND = "'Caveat','Brush Script MT',cursive"

export const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// {nombre} en el asunto o el mensaje se reemplaza por el primer nombre de cada persona.
export function personalize(template: string, fullName: string) {
  const firstName = fullName.trim().split(/\s+/)[0] ?? ""
  return template.replace(/\{nombre\}/gi, firstName)
}

export type EmailCopy = {
  subject: string
  preheader: string
  eyebrow: string
  title: string
  paragraphs: readonly string[]
  cta: string
  signature: string
  hashtag: string
}

type LayoutInput = {
  siteUrl: string
  // Texto que los clientes muestran al lado del asunto (no se ve dentro del correo)
  preheader: string
  eyebrow: string
  title: string
  // HTML del cuerpo, ya escapado
  body: string
  button?: { label: string; href: string }
  // Recuadro rosa con un dato importante (vencimiento del link, etc.)
  note?: string
  signature?: { text: string; hashtag: string }
  // HTML del pie oscuro, ya escapado
  footer: string
}

export const paragraphsHtml = (paragraphs: readonly string[]) =>
  paragraphs.map((p) => `<p style="margin:0 0 16px">${escapeHtml(p)}</p>`).join("")

// Estructura de marca: franja con los colores del manual en su proporción, logo, rótulo con punto
// verde, título en Saira, botón naranja, firma con el hashtag manuscrito y pie oscuro con el lema.
// El logo es PNG porque Gmail no muestra SVG.
export function emailLayout({
  siteUrl,
  preheader,
  eyebrow,
  title,
  body,
  button,
  note,
  signature,
  footer,
}: LayoutInput) {
  const buttonHtml = button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px"><tr>
          <td style="background:${BRAND_HEX.brand};border-radius:8px">
            <a href="${button.href}" style="display:inline-block;padding:15px 30px;font-family:${FONT_BODY};color:${BRAND_HEX.white};font-weight:600;font-size:16px;text-decoration:none">${escapeHtml(button.label)}&nbsp;&rarr;</a>
          </td>
        </tr></table>`
    : ""
  const noteHtml = note
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0"><tr>
          <td style="background:${BRAND_HEX.pinkTint};border-left:4px solid ${BRAND_HEX.pink};border-radius:8px;padding:14px 18px;font-size:14px;line-height:1.55;color:${EMAIL.text}">${escapeHtml(note)}</td>
        </tr></table>`
    : ""
  const signatureHtml = signature
    ? `<p style="margin:32px 0 0;font-size:15px;color:${EMAIL.text}">${escapeHtml(signature.text).replace(/\n/g, "<br>")}</p>
        <p style="margin:4px 0 0;font-family:${FONT_HAND};font-size:28px;line-height:1.2;color:${BRAND_HEX.green};font-weight:700">${escapeHtml(signature.hashtag)}</p>`
    : ""

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Saira:wght@600;700&family=Jost:wght@400;600&family=Caveat:wght@700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${BRAND_HEX.pinkTint};font-family:${FONT_BODY};color:${BRAND_HEX.ink}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BRAND_HEX.pinkTint}" style="background:${BRAND_HEX.pinkTint};background-image:linear-gradient(180deg,${BRAND_HEX.pinkTint} 0%,${EMAIL.greenTint} 100%);padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND_HEX.white};border-radius:8px;overflow:hidden;box-shadow:0 12px 32px rgba(26,26,26,0.08)">
        <tr><td style="padding:0;font-size:0;line-height:0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="70%" height="6" style="background:${BRAND_HEX.green};height:6px"></td>
            <td width="20%" height="6" style="background:${BRAND_HEX.pink};height:6px"></td>
            <td width="10%" height="6" style="background:${BRAND_HEX.brand};height:6px"></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:32px 40px 0">
          <a href="${siteUrl}"><img src="${siteUrl}/brand/mujeresxmas-logo-email.png" width="180" height="39" alt="Mujeres x Más" style="display:block;border:0;font-family:${FONT_TITLE};color:${BRAND_HEX.ink};font-size:22px;font-weight:700"></a>
        </td></tr>
        <tr><td style="padding:36px 40px 40px;font-size:16px;line-height:1.65;color:${EMAIL.text}">
          <p style="margin:0 0 14px;font-family:${FONT_TITLE};font-size:12px;letter-spacing:0.16em;text-transform:uppercase;font-weight:600;color:${BRAND_HEX.ink}"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${BRAND_HEX.green};margin-right:8px;vertical-align:middle"></span>${escapeHtml(eyebrow)}</p>
          <h1 style="margin:0 0 20px;font-family:${FONT_TITLE};font-size:30px;line-height:1.15;letter-spacing:-0.01em;font-weight:700;color:${BRAND_HEX.ink}">${escapeHtml(title)}</h1>
          ${body}
          ${buttonHtml}
          ${noteHtml}
          ${signatureHtml}
        </td></tr>
        <tr><td style="background:${BRAND_HEX.ink};padding:28px 40px">
          <p style="margin:0 0 10px;font-family:${FONT_TITLE};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;color:${BRAND_HEX.pink}">Capacitar &middot; Relacionar &middot; Incluir</p>
          <p style="margin:0;font-size:12px;line-height:1.6;color:${EMAIL.footerText}">${footer}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

const footerLink = (href: string, label: string) =>
  `<a href="${href}" style="color:${BRAND_HEX.white};text-decoration:underline">${escapeHtml(label)}</a>`

function unsubscribeFooter(unsubscribeUrl?: string) {
  return unsubscribeUrl
    ? `Recibís este correo porque te sumaste a Mujeres x Más. ${footerLink(unsubscribeUrl, "Darme de baja")}`
    : "Correo de prueba enviado desde el panel de Mujeres x Más."
}

// Texto escrito en el panel → HTML simple: párrafos por línea en blanco, saltos de línea y
// links automáticos. Todo se escapa antes, así que no se puede inyectar HTML.
function textToHtml(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => {
      const html = escapeHtml(paragraph.trim())
        .replace(/(https?:\/\/[^\s<]+)/g, `<a href="$1" style="color:${BRAND_HEX.brand}">$1</a>`)
        .replace(/\n/g, "<br>")
      return `<p style="margin:0 0 16px">${html}</p>`
    })
    .join("")
}

// Correo masivo escrito en el panel: el asunto va como título y el texto abajo.
export function campaignEmail({
  subject,
  body,
  siteUrl,
  unsubscribeUrl,
}: {
  subject: string
  body: string
  siteUrl: string
  unsubscribeUrl?: string
}) {
  const html = emailLayout({
    siteUrl,
    preheader: body.slice(0, 120),
    eyebrow: "Novedades de la comunidad",
    title: subject,
    body: textToHtml(body),
    signature: { text: "Con cariño,\nel equipo de Mujeres x Más", hashtag: "#CrecemosJuntas" },
    footer: unsubscribeFooter(unsubscribeUrl),
  })
  const text = unsubscribeUrl ? `${body}\n\n—\nPara darte de baja: ${unsubscribeUrl}` : body
  return { html, text }
}

// Agradecimiento al sumarse en /sumate. Con ebook, suma el párrafo que lo presenta y el botón para
// descargarlo; sin ebook, sale sin botón.
export function thankYouEmail({
  copy,
  fullName,
  siteUrl,
  unsubscribeUrl,
  ebookUrl,
}: {
  copy: EmailCopy & { ebookNote: string }
  fullName: string
  siteUrl: string
  unsubscribeUrl: string
  ebookUrl: string | null
}) {
  const title = personalize(copy.title, fullName)
  const paragraphs = ebookUrl ? [...copy.paragraphs, copy.ebookNote] : copy.paragraphs
  const html = emailLayout({
    siteUrl,
    preheader: copy.preheader,
    eyebrow: copy.eyebrow,
    title,
    body: paragraphsHtml(paragraphs),
    button: ebookUrl ? { label: copy.cta, href: ebookUrl } : undefined,
    signature: { text: copy.signature, hashtag: copy.hashtag },
    footer: unsubscribeFooter(unsubscribeUrl),
  })
  const text = [
    title,
    ...paragraphs,
    ...(ebookUrl ? [`${copy.cta}: ${ebookUrl}`] : []),
    copy.signature,
    copy.hashtag,
    `—\nPara darte de baja: ${unsubscribeUrl}`,
  ].join("\n\n")
  return { subject: personalize(copy.subject, fullName), html, text }
}

// Bienvenida al confirmar la cuenta.
export function welcomeEmail({
  copy,
  siteUrl,
  accountPath,
}: {
  copy: EmailCopy
  siteUrl: string
  accountPath: string
}) {
  const html = emailLayout({
    siteUrl,
    preheader: copy.preheader,
    eyebrow: copy.eyebrow,
    title: copy.title,
    body: paragraphsHtml(copy.paragraphs),
    button: { label: copy.cta, href: `${siteUrl}${accountPath}` },
    signature: { text: copy.signature, hashtag: copy.hashtag },
    footer: `Recibís este correo porque creaste tu cuenta en Mujeres x Más. ${footerLink(siteUrl, "Ir al sitio")}`,
  })
  const text = `${copy.title}\n\n${copy.paragraphs.join("\n\n")}\n\n${copy.cta}: ${siteUrl}${accountPath}\n\n${copy.signature}\n${copy.hashtag}`
  return { subject: copy.subject, html, text }
}

// Aviso interno para el equipo: título, los datos en una tabla y un botón al panel.
export function adminNoticeEmail({
  title,
  intro,
  rows,
  siteUrl,
  panelPath,
  panelLabel,
}: {
  title: string
  intro: string
  rows: [label: string, value: string][]
  siteUrl: string
  panelPath: string
  panelLabel: string
}) {
  const table = rows
    .map(
      ([label, value], index) =>
        `<tr><td style="padding:12px 16px;${index ? `border-top:1px solid ${BRAND_HEX.white};` : ""}font-size:13px;color:${EMAIL.muted};width:38%;vertical-align:top">${escapeHtml(label)}</td><td style="padding:12px 16px;${index ? `border-top:1px solid ${BRAND_HEX.white};` : ""}font-size:15px;font-weight:600;color:${BRAND_HEX.ink}">${escapeHtml(value)}</td></tr>`
    )
    .join("")
  const body = `<p style="margin:0 0 20px">${escapeHtml(intro)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL.greenTint};border-radius:8px">${table}</table>`
  const html = emailLayout({
    siteUrl,
    preheader: rows.map(([, value]) => value).join(" · "),
    eyebrow: "Aviso del sitio",
    title,
    body,
    button: { label: panelLabel, href: `${siteUrl}${panelPath}` },
    footer: "Aviso automático del sitio de Mujeres x Más para el equipo.",
  })
  const text = `${title}\n\n${intro}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${panelLabel}: ${siteUrl}${panelPath}`
  return { html, text }
}

// Plantillas de Supabase Auth (confirmación y recuperación). `link` y `siteUrl` llevan las
// variables de Supabase ({{ .SiteURL }}, {{ .TokenHash }}…), que se reemplazan al enviar.
export function authEmailTemplate({
  copy,
  siteUrl,
  link,
}: {
  copy: {
    preheader: string
    eyebrow: string
    title: string
    paragraphs: readonly string[]
    cta: string
    note: string
    footer: string
  }
  siteUrl: string
  link: string
}) {
  return emailLayout({
    siteUrl,
    preheader: copy.preheader,
    eyebrow: copy.eyebrow,
    title: copy.title,
    body: paragraphsHtml(copy.paragraphs),
    button: { label: copy.cta, href: link },
    note: copy.note,
    footer: escapeHtml(copy.footer),
  })
}
