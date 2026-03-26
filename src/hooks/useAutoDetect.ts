import { useState, useEffect, useRef } from 'react'
import { detectEncoding } from '../lib/detect'
import type { EncodingType } from '../lib/constants'

export function useAutoDetect(input: string, debounceMs = 300): EncodingType | null {
  const [detected, setDetected] = useState<EncodingType | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!input) {
      setDetected(null)
      return
    }

    timerRef.current = setTimeout(() => {
      setDetected(detectEncoding(input))
    }, debounceMs)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [input, debounceMs])

  return detected
}
