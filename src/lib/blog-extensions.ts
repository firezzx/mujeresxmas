import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import StarterKit from "@tiptap/starter-kit"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

// "/kiero" o una dirección del propio sitio. "//otro.com" es externa.
function isInternalLink(href: unknown) {
  if (typeof href !== "string") return false
  if (/^\/(?!\/)/.test(href)) return true
  return Boolean(SITE_URL) && (href === SITE_URL || href.startsWith(`${SITE_URL}/`))
}

// Los links del sitio abren en la misma pestaña; los externos, en una nueva.
const PostLink = Link.extend({
  renderHTML({ mark, HTMLAttributes }) {
    const attributes = { ...HTMLAttributes }
    delete attributes.target
    delete attributes.rel
    if (!isInternalLink(HTMLAttributes.href)) {
      attributes.target = "_blank"
      attributes.rel = "noopener noreferrer"
    }
    return this.parent!({ mark, HTMLAttributes: attributes })
  },
})

// Qué se puede escribir en una publicación. La misma lista usa el editor en el navegador y el
// servidor para generar el HTML: lo que no esté acá no llega a la página.
export const POST_EXTENSIONS = [
  StarterKit.configure({ heading: { levels: [2, 3] }, code: false, codeBlock: false, link: false }),
  PostLink.configure({
    openOnClick: false,
    defaultProtocol: "https",
    protocols: ["https", "mailto"],
    HTMLAttributes: { target: null, rel: null, class: null },
  }),
  Image.configure({ HTMLAttributes: { loading: "lazy" } }),
]
