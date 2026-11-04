"use client"

import { type Editor, EditorContent, type JSONContent, useEditor, useEditorState } from "@tiptap/react"
import { Placeholder } from "@tiptap/extensions"
import { useEffect, useRef, useState } from "react"

import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { useToast } from "@/components/toast/toaster"
import { POST_EXTENSIONS } from "@/lib/blog-extensions"
import { uploadBlogImage } from "@/lib/blog-images"
import { blogImageUrl } from "@/lib/blog-shared"
import { cn } from "@/lib/utils"
import type { PostDoc } from "@/lib/validations/blog"

const SMALL_FIELD_CLASS =
  "h-10 min-w-0 flex-1 basis-40 rounded-lg border border-border bg-background px-3 text-base outline-none sm:text-sm transition-[border-color,box-shadow] duration-300 ease-premium placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:ring-4 focus:ring-ring/15"

const SMALL_BUTTON_CLASS =
  "h-10 shrink-0 cursor-pointer rounded-lg px-3 text-[13px] font-medium ring-1 ring-border transition-colors duration-300 hover:bg-foreground/[0.04]"

type ToolProps = {
  label: string
  icon?: IconName
  text?: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}

function Tool({ label, icon, text, active, disabled, onClick }: ToolProps) {
  return (
    <IconHoverArea>
      <button
        type="button"
        title={label}
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        // Sin perder la selección del texto al tocar el botón
        onMouseDown={(event) => event.preventDefault()}
        onClick={onClick}
        className={cn(
          "flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-md px-2 text-[13px] font-medium whitespace-nowrap lg:h-9 lg:min-w-9 transition-colors duration-200",
          active
            ? "bg-brand-soft text-foreground"
            : "text-foreground/65 hover:bg-foreground/[0.06] hover:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        {icon ? <HoverIcon name={icon} size={16} /> : text}
      </button>
    </IconHoverArea>
  )
}

const Divider = () => <span aria-hidden className="mx-1 h-5 w-px bg-border" />

function Toolbar({
  editor,
  uploading,
  linkOpen,
  onToggleLink,
  onPickImage,
}: {
  editor: Editor
  uploading: boolean
  linkOpen: boolean
  onToggleLink: () => void
  onPickImage: () => void
}) {
  // Solo esta barra se vuelve a dibujar cuando cambia la selección
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })
  const chain = () => editor.chain().focus()

  return (
    <div
      role="toolbar"
      aria-label="Formato del texto"
      className="flex items-center gap-0.5 overflow-x-auto rounded-t-lg border-b border-border bg-background p-1.5 pr-8 [scrollbar-width:none] max-lg:[mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] lg:flex-wrap lg:pr-1.5 [&>*]:shrink-0"
    >
      <Tool
        label="Título de sección"
        text="H2"
        active={state.h2}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
      />
      <Tool label="Subtítulo" text="H3" active={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
      <Divider />
      <Tool label="Negrita" icon="bold" active={state.bold} onClick={() => chain().toggleBold().run()} />
      <Tool label="Cursiva" icon="italic" active={state.italic} onClick={() => chain().toggleItalic().run()} />
      <Tool
        label="Subrayado"
        icon="underline"
        active={state.underline}
        onClick={() => chain().toggleUnderline().run()}
      />
      <Tool label="Tachado" text="Tachado" active={state.strike} onClick={() => chain().toggleStrike().run()} />
      <Tool label="Link" icon="link" active={state.link || linkOpen} onClick={onToggleLink} />
      <Divider />
      <Tool
        label="Lista con viñetas"
        text="Lista"
        active={state.bullet}
        onClick={() => chain().toggleBulletList().run()}
      />
      <Tool
        label="Lista numerada"
        text="1. Lista"
        active={state.ordered}
        onClick={() => chain().toggleOrderedList().run()}
      />
      <Tool label="Cita" text="Cita" active={state.quote} onClick={() => chain().toggleBlockquote().run()} />
      <Tool label="Línea divisoria" text="Línea" onClick={() => chain().setHorizontalRule().run()} />
      <Tool
        label="Insertar imagen"
        text={uploading ? "Subiendo…" : "Imagen"}
        disabled={uploading}
        onClick={onPickImage}
      />
      <Divider />
      <Tool label="Deshacer" icon="undo" disabled={!state.canUndo} onClick={() => chain().undo().run()} />
      <Tool label="Rehacer" icon="redo" disabled={!state.canRedo} onClick={() => chain().redo().run()} />
    </div>
  )
}

// Panel para escribir o quitar el link del texto seleccionado.
function LinkPanel({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const [url, setUrl] = useState<string>(() => editor.getAttributes("link").href ?? "")
  const [error, setError] = useState(false)

  function apply() {
    const value = url.trim()
    if (!value) return
    // "ejemplo.com" → "https://ejemplo.com". Las direcciones del propio sitio ("/quiero") quedan igual.
    const href = /^(https?:\/\/|mailto:|\/)/i.test(value) ? value : `https://${value}`
    const chain = editor.chain().focus().extendMarkRange("link")
    const applied =
      editor.state.selection.empty && !editor.isActive("link")
        ? chain.insertContent({ type: "text", text: value, marks: [{ type: "link", attrs: { href } }] }).run()
        : chain.setLink({ href }).run()
    if (!applied) {
      setError(true)
      return
    }
    onClose()
  }

  return (
    <div className="border-b border-border bg-foreground/[0.02] p-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          autoFocus
          type="url"
          aria-label="Dirección del link"
          aria-invalid={error ? true : undefined}
          placeholder="https://… o /quiero"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value)
            setError(false)
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
              apply()
            }
            if (event.key === "Escape") onClose()
          }}
          className={SMALL_FIELD_CLASS}
        />
        <button type="button" onClick={apply} className={SMALL_BUTTON_CLASS}>
          Aplicar
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().extendMarkRange("link").unsetLink().run()
              onClose()
            }}
            className={SMALL_BUTTON_CLASS}
          >
            Quitar link
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-[13px] text-destructive">Esa dirección no es válida.</p>}
    </div>
  )
}

// Descripción de la imagen seleccionada, para accesibilidad y buscadores.
function ImageAltPanel({ editor }: { editor: Editor }) {
  const alt = useEditorState({
    editor,
    selector: ({ editor: e }) => (e.isActive("image") ? ((e.getAttributes("image").alt as string | null) ?? "") : null),
  })
  if (alt === null) return null

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border bg-foreground/[0.02] p-2">
      <input
        aria-label="Descripción de la imagen"
        placeholder="Describí la imagen para quien no pueda verla"
        maxLength={160}
        value={alt}
        onChange={(event) => editor.commands.updateAttributes("image", { alt: event.target.value })}
        className={SMALL_FIELD_CLASS}
      />
      <button
        type="button"
        onClick={() => editor.chain().focus().deleteSelection().run()}
        className={SMALL_BUTTON_CLASS}
      >
        Quitar imagen
      </button>
    </div>
  )
}

type RichEditorProps = {
  label: string
  content: PostDoc
  error?: string
  onChange: (doc: PostDoc) => void
}

// Editor del contenido de una publicación. Guarda un documento JSON; el HTML lo genera el
// servidor con las mismas extensiones (ver savePost).
export function RichEditor({ label, content, error, onChange }: RichEditorProps) {
  const { toast } = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  // Las imágenes pegadas o arrastradas se suben con la misma función que el botón
  const insertImageRef = useRef<(file: File) => void>(() => {})

  const editor = useEditor({
    extensions: [...POST_EXTENSIONS, Placeholder.configure({ placeholder: "Empezá a escribir tu publicación…" })],
    content: content as JSONContent,
    // El servidor no dibuja el editor: evita diferencias al hidratar
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: "post-content min-h-96 px-4 py-5 outline-none sm:px-6",
        "aria-label": label,
      },
      handlePaste: (_view, event) => {
        const file = event.clipboardData?.files[0]
        if (!file?.type.startsWith("image/")) return false
        insertImageRef.current(file)
        return true
      },
      handleDrop: (_view, event) => {
        const file = event.dataTransfer?.files[0]
        if (!file?.type.startsWith("image/")) return false
        insertImageRef.current(file)
        return true
      },
    },
    // Los attrs de ProseMirror no son objetos planos y una Server Action no puede leerlos: se copian como JSON
    onUpdate: ({ editor: current }) => onChange(JSON.parse(JSON.stringify(current.getJSON())) as PostDoc),
  })

  async function insertImage(file: File) {
    if (!editor) return
    setUploading(true)
    const result = await uploadBlogImage(file, "inline")
    setUploading(false)
    if (!result.ok) {
      toast({ id: "blog-inline-image", tone: "error", title: "Algo no salió bien", message: result.message })
      return
    }
    editor
      .chain()
      .focus()
      .setImage({ src: blogImageUrl(result.path), alt: "" })
      .run()
  }
  useEffect(() => {
    insertImageRef.current = insertImage
  })

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div
        className={cn(
          "rounded-lg border bg-background/70 shadow-[0_1px_2px_0_rgb(26_26_26/0.04)] transition-[border-color,box-shadow] duration-300 ease-premium focus-within:border-foreground/30 focus-within:ring-4 focus-within:ring-ring/15",
          error ? "border-destructive/60" : "border-border"
        )}
      >
        {editor ? (
          <>
            <div className="sticky top-[57px] z-20 rounded-t-lg lg:top-[122px]">
              <Toolbar
                editor={editor}
                uploading={uploading}
                linkOpen={linkOpen}
                onToggleLink={() => setLinkOpen((open) => !open)}
                onPickImage={() => fileInput.current?.click()}
              />
              {linkOpen && <LinkPanel editor={editor} onClose={() => setLinkOpen(false)} />}
            </div>
            <EditorContent editor={editor} />
            <ImageAltPanel editor={editor} />
          </>
        ) : (
          <div aria-hidden className="h-[28rem] animate-pulse rounded-lg bg-foreground/[0.03]" />
        )}
      </div>
      {error && (
        <p role="alert" className="text-[13px] text-destructive">
          {error}
        </p>
      )}
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) void insertImage(file)
        }}
      />
    </div>
  )
}
