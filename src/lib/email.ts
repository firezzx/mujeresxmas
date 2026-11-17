import { Resend } from "resend"

import { BRAND_HEX } from "@/config/brand-effects"

// Envío de correos. Funciona con Brevo o con Resend según las variables de entorno (ver .env.example):
// - Brevo: BREVO_API_KEY y EMAIL_FROM con un remitente verificado en Brevo.
// - Resend: RESEND_API_KEY y EMAIL_FROM. Sin dominio verificado, solo llega al dueño de la cuenta.
// EMAIL_PROVIDER ("brevo" o "resend") elige uno si están las dos claves; si no, se usa la que haya.

type Provider = "brevo" | "resend"

function getProvider(): Provider | null {
  const brevo = Boolean(process.env.BREVO_API_KEY)
  const resend = Boolean(process.env.RESEND_API_KEY)
  const chosen = process.env.EMAIL_PROVIDER
  if (chosen === "brevo") return brevo ? "brevo" : null
  if (chosen === "resend") return resend ? "resend" : null
  return brevo ? "brevo" : resend ? "resend" : null
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
  return getProvider() === "brevo" ? sendWithBrevo(emails) : sendWithResend(emails)
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
