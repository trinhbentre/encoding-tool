import { Button, CopyButton, TextArea } from '@web-tools/ui'

interface Props {
  value: string
  error: string
  onDownload: () => void
}

export function OutputPanel({ value, error, onDownload }: Props) {
  return (
    <TextArea
      label="Output"
      value={value}
      readOnly
      showByteCount
      error={error}
      actions={
        <>
          <CopyButton value={value} size="sm" />
          <Button size="sm" variant="secondary" onClick={onDownload} disabled={!value}>Download</Button>
        </>
      }
    />
  )
}
