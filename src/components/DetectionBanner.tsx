import { useCallback } from 'react'
import { ENCODINGS } from '../lib/constants'
import type { EncodingType } from '../lib/constants'

interface Props {
  detectedType: EncodingType | null
  activeType: EncodingType
  onUse: (type: EncodingType) => void
}

export function DetectionBanner({ detectedType, activeType, onUse }: Props) {
  const handleUse = useCallback(() => {
    if (detectedType) onUse(detectedType)
  }, [detectedType, onUse])

  if (!detectedType || detectedType === activeType) return null

  const label = ENCODINGS.find(e => e.id === detectedType)?.label ?? detectedType

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-accent/10 border border-accent/30 text-xs">
      <span className="text-text-secondary">
        ⚡ Detected: likely <span className="text-accent font-medium">{label}</span>
      </span>
      <button
        type="button"
        onClick={handleUse}
        className="btn-secondary text-xs py-0.5 px-2 shrink-0"
      >
        Use this
      </button>
    </div>
  )
}
