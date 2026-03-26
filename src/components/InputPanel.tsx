import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  onPaste: () => void
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function InputPanel({ value, onChange, onClear, onPaste }: Props) {
  const [byteSize, setByteSize] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setByteSize(new Blob([value]).size)
    }, 100)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }, [onChange])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Input</span>
        <div className="flex gap-2">
          <button type="button" onClick={onPaste} className="btn-secondary text-xs py-1 px-2">
            Paste
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={!value}
            className="btn-secondary text-xs py-1 px-2"
          >
            Clear
          </button>
        </div>
      </div>

      <textarea
        className="w-full h-40 bg-surface-700 border border-surface-600 rounded-md px-3 py-2 text-sm font-mono text-text-primary placeholder-text-muted resize-y focus:outline-none focus:border-accent transition-colors"
        placeholder="Paste or type text here…"
        value={value}
        onChange={handleChange}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />

      <div className="text-xs text-text-muted font-mono">
        {value.length.toLocaleString()} chars · {formatSize(byteSize)}
      </div>
    </div>
  )
}
