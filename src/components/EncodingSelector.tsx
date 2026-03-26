import { useCallback } from 'react'
import { ENCODINGS } from '../lib/constants'
import type { EncodingType } from '../lib/constants'

interface Props {
  activeType: EncodingType
  onTypeChange: (type: EncodingType) => void
}

export function EncodingSelector({ activeType, onTypeChange }: Props) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent, type: EncodingType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onTypeChange(type)
    }
  }, [onTypeChange])

  return (
    <div className="flex flex-wrap gap-1 px-4 py-3 border-b border-surface-700 bg-surface-800">
      {ENCODINGS.map(enc => (
        <button
          key={enc.id}
          type="button"
          onClick={() => onTypeChange(enc.id)}
          onKeyDown={e => handleKeyDown(e, enc.id)}
          className={[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150',
            activeType === enc.id
              ? 'bg-accent text-surface-900'
              : 'bg-surface-700 hover:bg-surface-600 text-text-secondary hover:text-text-primary border border-surface-600',
          ].join(' ')}
          aria-pressed={activeType === enc.id}
          title={`${enc.label} (⌘${enc.shortcut})`}
        >
          {enc.label}
        </button>
      ))}
    </div>
  )
}
