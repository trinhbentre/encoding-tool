import { Button, TextArea } from '@web-tools/ui'

interface Props {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  onPaste: () => void
}

export function InputPanel({ value, onChange, onClear, onPaste }: Props) {
  return (
    <TextArea
      label="Input"
      value={value}
      onChange={onChange}
      showByteCount
      placeholder="Paste or type text here…"
      rows={8}
      actions={
        <>
          <Button size="sm" variant="secondary" onClick={onPaste}>Paste</Button>
          <Button size="sm" variant="secondary" onClick={onClear} disabled={!value}>Clear</Button>
        </>
      }
    />
  )
}
