import { ModeSelector, getPlatformMod } from '@web-tools/ui'
import { ENCODINGS } from '../lib/constants'
import type { EncodingType } from '../lib/constants'

interface Props {
  activeType: EncodingType
  onTypeChange: (type: EncodingType) => void
}

export function EncodingSelector({ activeType, onTypeChange }: Props) {
  const mod = getPlatformMod()
  const options = ENCODINGS.map(enc => ({
    id: enc.id,
    label: enc.label,
    shortcut: `${mod}${enc.shortcut}`,
  }))

  return (
    <ModeSelector
      options={options}
      activeId={activeType}
      onChange={id => onTypeChange(id as EncodingType)}
      variant="bar"
      aria-label="Select encoding type"
    />
  )
}
