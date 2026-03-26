const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform)
const mod = isMac ? '⌘' : 'Ctrl'
const shift = isMac ? '⇧' : 'Shift'

const HINTS = [
  `${mod}1–6 switch`,
  `${mod}E encode`,
  `${mod}D decode`,
  `${mod}${shift}C copy`,
  `${mod}${shift}S swap`,
  `${mod}${shift}X clear`,
]

export function ShortcutHints() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted font-mono justify-center">
      {HINTS.map(hint => (
        <span key={hint}>{hint}</span>
      ))}
    </div>
  )
}
