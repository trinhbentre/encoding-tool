import { Button } from '@web-tools/ui'

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
        <Button variant="primary" onClick={onEncode} disabled={disabled}>
          ← Encode
        </Button>
        <Button variant="secondary" onClick={onSwap} disabled={disabled} title="Swap input ↔ output (⌘⇧S)">
          ⇅ Swap
        </Button>
        <Button variant="primary" onClick={onDecode} disabled={disabled}>
          Decode →
        </Button>
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
