import type { EncodingType } from './constants'

// ─── Base64 (Unicode-safe) ───────────────────────────────────────────────────

function encodeBase64(s: string): string {
  return btoa(unescape(encodeURIComponent(s)))
}

function decodeBase64(s: string): string {
  try {
    return decodeURIComponent(escape(atob(s.trim())))
  } catch {
    throw new Error('Invalid Base64: input contains illegal characters or incorrect padding')
  }
}

// ─── URL ─────────────────────────────────────────────────────────────────────

function encodeURL(s: string): string {
  return encodeURIComponent(s)
}

function decodeURL(s: string): string {
  try {
    return decodeURIComponent(s)
  } catch {
    throw new Error('Invalid URL encoding: malformed percent-encoded sequence')
  }
}

// ─── HTML Entities ───────────────────────────────────────────────────────────

const HTML_ENCODE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
}

function encodeHTML(s: string): string {
  return s.replace(/[&<>"']/g, ch => HTML_ENCODE_MAP[ch])
}

function decodeHTML(s: string): string {
  // DOMParser is sandboxed — no script execution, safe for arbitrary input
  const doc = new DOMParser().parseFromString(s, 'text/html')
  return doc.body.textContent ?? ''
}

// ─── JSON Escape ─────────────────────────────────────────────────────────────

function encodeJSON(s: string): string {
  // JSON.stringify produces a quoted string — slice off the surrounding quotes
  return JSON.stringify(s).slice(1, -1)
}

function decodeJSON(s: string): string {
  try {
    const parsed = JSON.parse('"' + s + '"')
    if (typeof parsed !== 'string') throw new Error('Unexpected result type')
    return parsed
  } catch {
    throw new Error('Invalid JSON escape sequence — ensure the input is a valid JSON string value')
  }
}

// ─── Unicode Escape ───────────────────────────────────────────────────────────

function encodeUnicode(s: string): string {
  return [...s].map(char => {
    const cp = char.codePointAt(0)!
    if (cp <= 0xFFFF) {
      return `\\u${cp.toString(16).padStart(4, '0')}`
    }
    // Surrogate pair for characters above U+FFFF
    const adjusted = cp - 0x10000
    const high = 0xD800 + Math.floor(adjusted / 0x400)
    const low  = 0xDC00 + (adjusted % 0x400)
    return `\\u${high.toString(16).padStart(4, '0')}\\u${low.toString(16).padStart(4, '0')}`
  }).join('')
}

function decodeUnicode(s: string): string {
  try {
    // Handle \u{XXXXX} extended format first, then \uXXXX standard format
    return s
      .replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
  } catch {
    throw new Error('Invalid Unicode escape sequence')
  }
}

// ─── Hex ─────────────────────────────────────────────────────────────────────

function encodeHex(s: string): string {
  const bytes = new TextEncoder().encode(s)
  return Array.from(bytes, b => `\\x${b.toString(16).padStart(2, '0')}`).join('')
}

function decodeHex(s: string): string {
  const trimmed = s.trim()
  let bytes: number[]

  if (/\\x/i.test(trimmed)) {
    // \xXX format — extract all \xXX sequences
    const regex = /\\x([0-9a-fA-F]{2})/gi
    bytes = []
    let match: RegExpExecArray | null
    while ((match = regex.exec(trimmed)) !== null) {
      bytes.push(parseInt(match[1], 16))
    }
    if (bytes.length === 0) throw new Error('No valid \\xXX sequences found')
  } else {
    // Raw hex pairs (with optional spaces or 0x prefix)
    const cleaned = trimmed.replace(/\s+/g, '').replace(/^0x/i, '')
    if (cleaned.length % 2 !== 0) throw new Error('Invalid hex: odd number of digits')
    bytes = []
    for (let i = 0; i < cleaned.length; i += 2) {
      const byte = parseInt(cleaned.substring(i, i + 2), 16)
      if (isNaN(byte)) throw new Error('Invalid hex character')
      bytes.push(byte)
    }
  }

  return new TextDecoder().decode(new Uint8Array(bytes))
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export function encode(type: EncodingType, input: string): string {
  switch (type) {
    case 'base64':  return encodeBase64(input)
    case 'url':     return encodeURL(input)
    case 'html':    return encodeHTML(input)
    case 'json':    return encodeJSON(input)
    case 'unicode': return encodeUnicode(input)
    case 'hex':     return encodeHex(input)
  }
}

export function decode(type: EncodingType, input: string): string {
  switch (type) {
    case 'base64':  return decodeBase64(input)
    case 'url':     return decodeURL(input)
    case 'html':    return decodeHTML(input)
    case 'json':    return decodeJSON(input)
    case 'unicode': return decodeUnicode(input)
    case 'hex':     return decodeHex(input)
  }
}
