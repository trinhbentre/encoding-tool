import type { EncodingType } from './constants'

/**
 * Heuristic detection of encoding type from a string.
 * Returns the most likely EncodingType or null if ambiguous/unknown.
 */
export function detectEncoding(s: string): EncodingType | null {
  if (!s || s.length < 4) return null

  const trimmed = s.trim()

  // ── Hex (\xXX format) ───────────────────────────────────────────────────
  if (/^(\\x[0-9a-fA-F]{2})+$/.test(trimmed)) return 'hex'

  // ── Unicode escape (\uXXXX format) ──────────────────────────────────────
  if (/^(\\u[0-9a-fA-F]{4})+$/.test(trimmed)) return 'unicode'

  // ── URL encoded (has %XX sequences, not valid as plain text) ────────────
  if (/%[0-9a-fA-F]{2}/.test(trimmed) && /^[^<>&"]*$/.test(trimmed)) return 'url'

  // ── HTML entities (has &...; patterns) ──────────────────────────────────
  if (/&(amp|lt|gt|quot|#x?[0-9a-fA-F]+);/.test(trimmed)) return 'html'

  // ── JSON escaped (has \n \t \" \\ etc. but is not a raw string) ─────────
  if (/\\[nrtbf\\/"]/.test(trimmed) && !/%[0-9a-fA-F]{2}/.test(trimmed)) return 'json'

  // ── Base64 (valid charset, length divisible by 4, not obviously plain text) ─
  const base64Re = /^[A-Za-z0-9+/]+=*$/
  if (
    base64Re.test(trimmed) &&
    trimmed.length % 4 === 0 &&
    trimmed.length >= 8 &&
    // Avoid false-positives on plain lowercase words
    !/^[a-z ]+$/.test(trimmed)
  ) {
    return 'base64'
  }

  return null
}
