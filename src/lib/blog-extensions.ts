import Image from "@tiptap/extension-image"
import StarterKit from "@tiptap/starter-kit"

// Qué se puede escribir en una publicación. La misma lista usa el editor en el navegador y el
// servidor para generar el HTML: lo que no esté acá no llega a la página.
export const POST_EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    link: {
      openOnClick: false,
      defaultProtocol: "https",
      protocols: ["https", "mailto"],
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
  Image.configure({ HTMLAttributes: { loading: "lazy" } }),
]
