import { useEffect, useCallback } from 'react'
import { ENCODINGS } from '../lib/constants'
import type { EncodingType } from '../lib/constants'

export interface ShortcutHandlers {
  onEncode?: () => void
  onDecode?: () => void
  onCopy?: () => void
  onClear?: () => void
  onSwap?: () => void
  onTypeChange?: (type: EncodingType) => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const { onEncode, onDecode, onCopy, onClear, onSwap, onTypeChange } = handlers

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const ctrl = e.ctrlKey || e.metaKey

    if (!ctrl) return

    // ⌘⇧C — copy output
    if (e.shiftKey && e.key === 'C') {
      e.preventDefault()
      onCopy?.()
      return
    }

    // ⌘⇧X — clear all
    if (e.shiftKey && e.key === 'X') {
      e.preventDefault()
      onClear?.()
      return
    }

    // ⌘⇧S — swap
    if (e.shiftKey && e.key === 'S') {
      e.preventDefault()
      onSwap?.()
      return
    }

    if (e.shiftKey) return

    // ⌘E — encode
    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault()
      onEncode?.()
      return
    }

    // ⌘D — decode
    if (e.key === 'd' || e.key === 'D') {
      e.preventDefault()
      onDecode?.()
      return
    }

    // ⌘1–6 — switch encoding type
    const digit = parseInt(e.key, 10)
    if (digit >= 1 && digit <= ENCODINGS.length) {
      e.preventDefault()
      const enc = ENCODINGS[digit - 1]
      if (enc) onTypeChange?.(enc.id)
    }
  }, [onEncode, onDecode, onCopy, onClear, onSwap, onTypeChange])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
