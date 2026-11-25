import nodemailer from "nodemailer"
import { Resend } from "resend"

import { BRAND_HEX } from "@/config/brand-effects"

// Envío de correos. Funciona con SMTP (p. ej. el correo de Hostinger), Brevo o Resend según las
// variables de entorno (ver .env.example):
// - SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD y EMAIL_FROM con la misma casilla que SMTP_USER.
// - Brevo: BREVO_API_KEY y EMAIL_FROM con un remitente verificado en Brevo.
// - Resend: RESEND_API_KEY y EMAIL_FROM. Sin dominio verificado, solo llega al dueño de la cuenta.
// EMAIL_PROVIDER ("smtp", "brevo" o "resend") elige uno si hay varios configurados; si no, se usa el que haya.

type Provider = "smtp" | "brevo" | "resend"

function getProvider(): Provider | null {
  const available: Record<Provider, boolean> = {
    smtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    brevo: Boolean(process.env.BREVO_API_KEY),
    resend: Boolean(process.env.RESEND_API_KEY),
  }
  const chosen = process.env.EMAIL_PROVIDER as Provider | undefined
  if (chosen && chosen in available) return available[chosen] ? chosen : null
  return (Object.keys(available) as Provider[]).find((provider) => available[provider]) ?? null
}

export function isEmailConfigured() {
  return Boolean(getProvider() && process.env.EMAIL_FROM)
}

export type OutgoingEmail = {
  to: string
  subject: string
  html: string
  text: string
  unsubscribeUrl?: string
}

// Grises del pie del correo (los clientes de correo no leen las variables CSS del sitio)
const EMAIL_MUTED = "#6B6B6B"
const EMAIL_RULE = "#EEEEEE"

type SendResult = { sent: number; failed: number }

// Envía los correos con el proveedor configurado. Devuelve cuántos salieron y cuántos fallaron.
export async function sendEmails(emails: OutgoingEmail[]): Promise<SendResult> {
  const provider = getProvider()
  if (provider === "smtp") return sendWithSmtp(emails)
  return provider === "brevo" ? sendWithBrevo(emails) : sendWithResend(emails)
}

// SMTP: una sola conexión que se reutiliza, de a pocos correos a la vez, con una pausa corta entre
// tandas para no superar el límite por minuto del servidor de correo (Hostinger corta si se envía muy rápido).
const SMTP_BATCH_SIZE = 5
const SMTP_PAUSE_MS = 1500

async function sendWithSmtp(emails: OutgoingEmail[]): Promise<SendResult> {
  const port = Number(process.env.SMTP_PORT || 465)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    pool: true,
    maxConnections: 1,
  })
  const from = process.env.EMAIL_FROM!
  let sent = 0
  let failed = 0

  try {
    for (let start = 0; start < emails.length; start += SMTP_BATCH_SIZE) {
      if (start > 0) await new Promise((resolve) => setTimeout(resolve, SMTP_PAUSE_MS))
      await Promise.all(
        emails.slice(start, start + SMTP_BATCH_SIZE).map(async (email) => {
          try {
            await transporter.sendMail({
              from,
              to: email.to,
              subject: email.subject,
              html: email.html,
              text: email.text,
              list: email.unsubscribeUrl ? { unsubscribe: email.unsubscribeUrl } : undefined,
            })
            sent++
          } catch (error) {
            failed++
            console.error("[sendWithSmtp]", error instanceof Error ? error.message : error)
          }
        })
      )
    }
  } finally {
    transporter.close()
  }
  return { sent, failed }
}

// "Mujeres x Más <hola@dominio.com>" → nombre y correo por separado (Brevo los pide así)
function parseSender(from: string) {
  const match = from.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/)
  return match ? { name: match[1] || undefined, email: match[2] } : { email: from.trim() }
}

// Brevo: un pedido por correo, de a 10 en paralelo para no pasar el límite de la API.
const BREVO_CONCURRENCY = 10

async function sendWithBrevo(emails: OutgoingEmail[]): Promise<SendResult> {
  const sender = parseSender(process.env.EMAIL_FROM!)
  let sent = 0
  let failed = 0

  const sendOne = async (email: OutgoingEmail) => {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY!,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender,
          to: [{ email: email.to }],
          subject: email.subject,
          htmlContent: email.html,
          textContent: email.text,
          headers: email.unsubscribeUrl ? { "List-Unsubscribe": `<${email.unsubscribeUrl}>` } : undefined,
        }),
      })
      if (response.ok) {
        sent++
      } else {
        failed++
        console.error("[sendWithBrevo]", response.status, await response.text())
      }
    } catch (error) {
      failed++
      console.error("[sendWithBrevo]", error)
    }
  }

  for (let start = 0; start < emails.length; start += BREVO_CONCURRENCY) {
    await Promise.all(emails.slice(start, start + BREVO_CONCURRENCY).map(sendOne))
  }
  return { sent, failed }
}

// Resend acepta hasta 100 correos por pedido.
const RESEND_BATCH_SIZE = 100

async function sendWithResend(emails: OutgoingEmail[]): Promise<SendResult> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.EMAIL_FROM!
  let sent = 0
  let failed = 0

  for (let start = 0; start < emails.length; start += RESEND_BATCH_SIZE) {
    const chunk = emails.slice(start, start + RESEND_BATCH_SIZE)
    const { data, error } = await resend.batch.send(
      chunk.map((email) => ({
        from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        headers: email.unsubscribeUrl ? { "List-Unsubscribe": `<${email.unsubscribeUrl}>` } : undefined,
      })),
      { batchValidation: "permissive" }
    )
    if (error || !data) {
      console.error("[sendWithResend]", error?.name, error?.message)
      failed += chunk.length
      continue
    }
    const errors = "errors" in data && Array.isArray(data.errors) ? data.errors.length : 0
    failed += errors
    sent += chunk.length - errors
  }

  return { sent, failed }
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// {nombre} en el asunto o el mensaje se reemplaza por el primer nombre de cada persona.
export function personalize(template: string, fullName: string) {
  const firstName = fullName.trim().split(/\s+/)[0] ?? ""
  return template.replace(/\{nombre\}/gi, firstName)
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

// Estructura de marca de todos los correos: franja verde con el logo en negro (como pide el
// manual), contenido sobre blanco y pie con la baja. El logo es PNG porque Gmail no muestra SVG.
function brandLayout({ siteUrl, content, footer }: { siteUrl: string; content: string; footer: string }) {
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:${BRAND_HEX.pinkTint};font-family:Helvetica,Arial,sans-serif;color:${BRAND_HEX.ink}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_HEX.pinkTint};padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND_HEX.white};border-radius:8px;overflow:hidden">
        <tr><td style="background:${BRAND_HEX.green};padding:28px 32px">
          <a href="${siteUrl}"><img src="${siteUrl}/brand/mujeresxmas-logo-email.png" width="200" height="43" alt="Mujeres x Más" style="display:block;border:0;color:${BRAND_HEX.ink};font-size:22px;font-weight:700"></a>
        </td></tr>
        <tr><td style="padding:32px 32px 12px;font-size:16px;line-height:1.6">${content}</td></tr>
        <tr><td style="padding:16px 32px 28px;font-size:12px;line-height:1.5;color:${EMAIL_MUTED};border-top:1px solid ${EMAIL_RULE}">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function unsubscribeFooter(unsubscribeUrl?: string) {
  return unsubscribeUrl
    ? `Recibís este correo porque te sumaste a Mujeres x Más. <a href="${unsubscribeUrl}" style="color:${BRAND_HEX.ink}">Darme de baja</a>`
    : "Correo de prueba enviado desde el panel de Mujeres x Más."
}

// Correo masivo escrito en el panel.
export function campaignEmail({
  body,
  siteUrl,
  unsubscribeUrl,
}: {
  body: string
  siteUrl: string
  unsubscribeUrl?: string
}) {
  const html = brandLayout({ siteUrl, content: textToHtml(body), footer: unsubscribeFooter(unsubscribeUrl) })
  const text = unsubscribeUrl
    ? `${body}

—
Para darte de baja: ${unsubscribeUrl}`
    : body
  return { html, text }
}

// Correo de agradecimiento al sumarse en /sumate. El botón va en naranja con texto blanco
// semibold, como los botones principales del sitio.
export function thankYouEmail({
  copy,
  fullName,
  siteUrl,
  unsubscribeUrl,
}: {
  copy: {
    subject: string
    title: string
    paragraphs: readonly string[]
    cta: string
    signature: string
    hashtag: string
  }
  fullName: string
  siteUrl: string
  unsubscribeUrl: string
}) {
  const title = escapeHtml(personalize(copy.title, fullName))
  const paragraphs = copy.paragraphs.map((p) => `<p style="margin:0 0 16px">${escapeHtml(p)}</p>`).join("")
  const content = `
    <h1 style="margin:0 0 20px;font-size:28px;line-height:1.15;letter-spacing:-0.02em;font-weight:700">${title}</h1>
    ${paragraphs}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 28px"><tr>
      <td style="background:${BRAND_HEX.brand};border-radius:8px">
        <a href="${siteUrl}" style="display:inline-block;padding:14px 26px;color:${BRAND_HEX.white};font-weight:600;font-size:15px;text-decoration:none">${escapeHtml(copy.cta)}</a>
      </td>
    </tr></table>
    <p style="margin:0 0 8px">${escapeHtml(copy.signature).replace(/\n/g, "<br>")}</p>
    <p style="margin:0 0 8px;font-family:'Caveat','Brush Script MT',cursive;font-size:24px;color:${BRAND_HEX.green};font-weight:700">${escapeHtml(copy.hashtag)}</p>`

  const text = [
    personalize(copy.title, fullName),
    ...copy.paragraphs,
    `${copy.cta}: ${siteUrl}`,
    copy.signature,
    copy.hashtag,
    `—\nPara darte de baja: ${unsubscribeUrl}`,
  ].join("\n\n")

  return {
    subject: personalize(copy.subject, fullName),
    html: brandLayout({ siteUrl, content, footer: unsubscribeFooter(unsubscribeUrl) }),
    text,
  }
}

// Casilla del equipo que recibe los avisos importantes (pedidos de empresas, registros en /sumate).
const adminNoticeAddress = () => process.env.ADMIN_NOTIFY_EMAIL?.trim() || null

// Aviso interno para el equipo: título, los datos en una tabla y un botón al panel.
export function adminNoticeEmail({
  title,
  rows,
  siteUrl,
  panelPath,
  panelLabel,
}: {
  title: string
  rows: [label: string, value: string][]
  siteUrl: string
  panelPath: string
  panelLabel: string
}) {
  const table = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 0;color:${EMAIL_MUTED};width:38%;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 0;font-weight:600">${escapeHtml(value)}</td></tr>`
    )
    .join("")
  const content = `
    <h1 style="margin:0 0 20px;font-size:24px;line-height:1.2;letter-spacing:-0.02em;font-weight:700">${escapeHtml(title)}</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;border-top:1px solid ${EMAIL_RULE}">${table}</table>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 20px"><tr>
      <td style="background:${BRAND_HEX.brand};border-radius:8px">
        <a href="${siteUrl}${panelPath}" style="display:inline-block;padding:12px 22px;color:${BRAND_HEX.white};font-weight:600;font-size:15px;text-decoration:none">${escapeHtml(panelLabel)}</a>
      </td>
    </tr></table>`
  const html = brandLayout({ siteUrl, content, footer: "Aviso automático del sitio de Mujeres x Más." })
  const text = `${title}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${panelLabel}: ${siteUrl}${panelPath}`
  return { html, text }
}

// Manda un aviso a la casilla del equipo, si hay una configurada y el envío de correos funciona.
export async function notifyTeam(subject: string, message: { html: string; text: string }) {
  const to = adminNoticeAddress()
  if (!to || !isEmailConfigured()) return
  const { failed } = await sendEmails([{ to, subject, ...message }])
  if (failed) console.error("[notifyTeam] no salió el aviso:", subject)
}

// Bienvenida al confirmar la cuenta: saludo, qué puede hacer y botón a su cuenta.
export function welcomeEmail({
  copy,
  siteUrl,
  accountPath,
}: {
  copy: {
    subject: string
    title: string
    paragraphs: readonly string[]
    cta: string
    signature: string
    hashtag: string
  }
  siteUrl: string
  accountPath: string
}) {
  const title = escapeHtml(copy.title)
  const paragraphs = copy.paragraphs.map((p) => `<p style="margin:0 0 16px">${escapeHtml(p)}</p>`).join("")
  const content = `
    <h1 style="margin:0 0 20px;font-size:28px;line-height:1.15;letter-spacing:-0.02em;font-weight:700">${title}</h1>
    ${paragraphs}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 28px"><tr>
      <td style="background:${BRAND_HEX.brand};border-radius:8px">
        <a href="${siteUrl}${accountPath}" style="display:inline-block;padding:14px 26px;color:${BRAND_HEX.white};font-weight:600;font-size:15px;text-decoration:none">${escapeHtml(copy.cta)}</a>
      </td>
    </tr></table>
    <p style="margin:0 0 8px">${escapeHtml(copy.signature).replace(/\n/g, "<br>")}</p>
    <p style="margin:0 0 8px;font-family:'Caveat','Brush Script MT',cursive;font-size:24px;color:${BRAND_HEX.green};font-weight:700">${escapeHtml(copy.hashtag)}</p>`
  const html = brandLayout({
    siteUrl,
    content,
    footer: "Recibís este correo porque creaste tu cuenta en Mujeres x Más.",
  })
  const text = `${copy.title}\n\n${copy.paragraphs.join("\n\n")}\n\n${copy.cta}: ${siteUrl}${accountPath}\n\n${copy.signature}\n${copy.hashtag}`
  return { subject: copy.subject, html, text }
}
