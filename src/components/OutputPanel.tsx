import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  value: string
  error: string
  onCopy: () => void
  onDownload: () => void
  copied: boolean
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function OutputPanelInner({ value, error, onCopy, onDownload, copied }: Props) {
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

  const handleCopy = useCallback(() => {
    if (value) onCopy()
  }, [value, onCopy])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Output</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className="btn-secondary text-xs py-1 px-2"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!value}
            className="btn-secondary text-xs py-1 px-2"
          >
            Download
          </button>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded-md bg-danger/10 border border-danger/30 text-danger text-xs font-mono">
          {error}
        </div>
      )}

      <textarea
        className="w-full h-40 bg-surface-700 border border-surface-600 rounded-md px-3 py-2 text-sm font-mono text-text-primary resize-y focus:outline-none focus:border-surface-600 transition-colors"
        readOnly
        value={value}
        spellCheck={false}
      />

      <div className="text-xs text-text-muted font-mono">
        {value.length.toLocaleString()} chars · {formatSize(byteSize)}
      </div>
    </div>
  )
}

export const OutputPanel = OutputPanelInner
