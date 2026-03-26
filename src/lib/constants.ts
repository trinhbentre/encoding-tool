export type EncodingType = 'base64' | 'url' | 'html' | 'json' | 'unicode' | 'hex'

export interface EncodingDef {
  id: EncodingType
  label: string
  shortcut: string
}

export const ENCODINGS: EncodingDef[] = [
  { id: 'base64',  label: 'Base64',  shortcut: '1' },
  { id: 'url',     label: 'URL',     shortcut: '2' },
  { id: 'html',    label: 'HTML',    shortcut: '3' },
  { id: 'json',    label: 'JSON',    shortcut: '4' },
  { id: 'unicode', label: 'Unicode', shortcut: '5' },
  { id: 'hex',     label: 'Hex',     shortcut: '6' },
]

export const STORAGE_KEY_ENCODING_TYPE = 'encoding-tool-type'
export const LARGE_INPUT_THRESHOLD = 1_000_000 // 1 MB — disable auto-transform above this
