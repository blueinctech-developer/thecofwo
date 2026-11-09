import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

type Props = { data?: unknown; className?: string }

/** Renders text written in the admin's rich text editor. */
export function RichText({ data, className = 'prose-cofwo' }: Props) {
  if (!data || typeof data !== 'object' || !('root' in (data as object))) return null
  return <LexicalRichText data={data as SerializedEditorState} className={className} />
}

/** True when a rich text field has any visible text. */
export const hasText = (data: unknown) => {
  const root = (data as { root?: { children?: unknown[] } } | null)?.root
  return Boolean(root?.children?.length && JSON.stringify(root).includes('"text":"'))
}
