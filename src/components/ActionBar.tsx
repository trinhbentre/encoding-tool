interface Props {
  onEncode: () => void
  onDecode: () => void
  onSwap: () => void
  autoMode: boolean
  onAutoModeToggle: () => void
  disabled: boolean
}

export function ActionBar({ onEncode, onDecode, onSwap, autoMode, onAutoModeToggle, disabled }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEncode}
          disabled={disabled}
          className="btn-primary"
        >
          ← Encode
        </button>
        <button
          type="button"
          onClick={onSwap}
          disabled={disabled}
          className="btn-secondary"
          title="Swap input ↔ output (⌘⇧S)"
        >
          ⇅ Swap
        </button>
        <button
          type="button"
          onClick={onDecode}
          disabled={disabled}
          className="btn-primary"
        >
          Decode →
        </button>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <span className="text-xs text-text-secondary">Auto</span>
        <button
          type="button"
          role="switch"
          aria-checked={autoMode}
          onClick={onAutoModeToggle}
          className={[
            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150',
            autoMode ? 'bg-accent' : 'bg-surface-600',
          ].join(' ')}
        >
          <span
            className={[
              'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-150',
              autoMode ? 'translate-x-4.5' : 'translate-x-0.5',
            ].join(' ')}
          />
        </button>
      </label>
    </div>
  )
}
