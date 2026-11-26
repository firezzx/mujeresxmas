// Prueba controlada de la API de partners de Kiero (lee KIERO_API_KEY de .env.local).
//
//   npm run kiero:prueba
//     Solo revisa la configuración. No se conecta con Kiero.
//
//   npm run kiero:prueba -- --email correo@de-prueba.com --confirmar
//     Hace UNA llamada real de alta (invitación) para ese correo y enseguida la baja, y muestra
//     las dos respuestas. Usar un correo propio de prueba, nunca el de una socia.
//
//   Con --solo-alta hace solo el alta (para recibir y ver el correo de invitación de Kiero) y con
//   --solo-baja solo la baja (para cancelar esa invitación después).

const DEFAULT_API_URL = "https://dashboard.kiero.tech"
const TIMEOUT_MS = 10_000

const args = process.argv.slice(2)
const emailIndex = args.indexOf("--email")
const email = emailIndex >= 0 ? args[emailIndex + 1] : undefined
const confirmed = args.includes("--confirmar")
const onlySubscribe = args.includes("--solo-alta")
const onlyCancel = args.includes("--solo-baja")

const apiKey = process.env.KIERO_API_KEY?.trim()
const base = (process.env.KIERO_API_URL || DEFAULT_API_URL).replace(/\/$/, "")

console.log("Kiero: revisión de la configuración")
console.log(`  URL de la API:  ${base}`)
console.log(`  Clave cargada:  ${apiKey ? `sí (${apiKey.length} caracteres)` : "no"}`)
console.log(`  KIERO_MODE:     ${process.env.KIERO_MODE || "(vacío: modo prueba)"}`)

if (!apiKey) {
  console.log("\nFalta la clave: pegala en .env.local después de KIERO_API_KEY= y volvé a correr esto.")
  process.exit(1)
}

if (!email || !confirmed) {
  console.log("\nNo se llamó a Kiero. Para la prueba real (un alta y una baja):")
  console.log("  npm run kiero:prueba -- --email correo@de-prueba.com --confirmar")
  process.exit(0)
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.log(`\nEl correo "${email}" no parece válido.`)
  process.exit(1)
}

async function call(path) {
  const started = Date.now()
  try {
    const response = await fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-API-Key": apiKey },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    const text = await response.text()
    let body
    try {
      body = JSON.parse(text)
    } catch {
      body = text.slice(0, 500)
    }
    console.log(`  ${response.status} en ${Date.now() - started} ms`)
    console.log(`  ${JSON.stringify(body, null, 2).replaceAll("\n", "\n  ")}`)
    return response.ok
  } catch (error) {
    console.log(`  Sin respuesta: ${error instanceof Error ? error.message : error}`)
    return false
  }
}

const results = []

if (!onlyCancel) {
  console.log(`\nAlta (invitación) de ${email}`)
  results.push(await call("/api/v1/partners/subscriptions/"))
}

if (!onlySubscribe) {
  console.log(`\nBaja de ${email}`)
  results.push(await call("/api/v1/partners/cancellations/"))
}

const ok = results.length > 0 && results.every(Boolean)
console.log(
  ok ? "\nListo: la API respondió bien." : "\nAlguna llamada falló: revisá la clave y las respuestas de arriba."
)
if (ok && onlySubscribe) {
  console.log(
    "La invitación quedó activa. Para cancelarla: npm run kiero:prueba -- --email ... --confirmar --solo-baja"
  )
}
// exitCode en vez de process.exit: en Windows, cortar con conexiones abiertas tira un aviso de Node
process.exitCode = ok ? 0 : 1
