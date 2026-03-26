import { useState, useCallback, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { EncodingSelector } from './components/EncodingSelector'
import { InputPanel } from './components/InputPanel'
import { ActionBar } from './components/ActionBar'
import { OutputPanel } from './components/OutputPanel'
import { DetectionBanner } from './components/DetectionBanner'
import { ShortcutHints } from './components/ShortcutHints'
import { useStorage } from './hooks/useStorage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useCopyToClipboard } from './hooks/useCopyToClipboard'
import { useAutoDetect } from './hooks/useAutoDetect'
import { encode, decode } from './lib/encodings'
import { STORAGE_KEY_ENCODING_TYPE, LARGE_INPUT_THRESHOLD } from './lib/constants'
import type { EncodingType } from './lib/constants'

export default function App() {
  const [encodingType, setEncodingType] = useStorage<EncodingType>(STORAGE_KEY_ENCODING_TYPE, 'base64')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [autoMode, setAutoMode] = useStorage<boolean>('encoding-tool-auto', true)
  const { copied, copy } = useCopyToClipboard()
  const detectedType = useAutoDetect(input)

  // ─── Auto-transform ───────────────────────────────────────────────────────
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!autoMode) return
    if (new Blob([input]).size > LARGE_INPUT_THRESHOLD) return

    if (autoTimerRef.current) clearTimeout(autoTimerRef.current)

    if (!input) {
      setOutput('')
      setError('')
      return
    }

    autoTimerRef.current = setTimeout(() => {
      try {
        setOutput(encode(encodingType, input))
        setError('')
      } catch (e) {
        setError((e as Error).message)
        setOutput('')
      }
    }, 150)

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
  }, [input, encodingType, autoMode])

  // ─── Manual actions ───────────────────────────────────────────────────────
  const handleEncode = useCallback(() => {
    if (!input) return
    try {
      setOutput(encode(encodingType, input))
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input, encodingType])

  const handleDecode = useCallback(() => {
    if (!input) return
    try {
      setOutput(decode(encodingType, input))
      setError('')
    } catch (e) {
      setError((e as Error).message)
      setOutput('')
    }
  }, [input, encodingType])

  const handleSwap = useCallback(() => {
    if (!output) return
    setInput(output)
    setOutput('')
    setError('')
  }, [output])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setError('')
  }, [])

  const handlePaste = useCallback(() => {
    navigator.clipboard.readText().then(text => {
      setInput(text)
    }).catch(() => {
      // Clipboard unavailable — silently ignore
    })
  }, [])

  const handleCopy = useCallback(() => {
    copy(output)
  }, [copy, output])

  const handleDownload = useCallback(() => {
    if (!output) return
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'encoded-output.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [output])

  const handleTypeChange = useCallback((type: EncodingType) => {
    setEncodingType(type)
    setOutput('')
    setError('')
  }, [setEncodingType])

  useKeyboardShortcuts({
    onEncode: handleEncode,
    onDecode: handleDecode,
    onCopy: handleCopy,
    onClear: handleClear,
    onSwap: handleSwap,
    onTypeChange: handleTypeChange,
  })

  const isLargeInput = new Blob([input]).size > LARGE_INPUT_THRESHOLD

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col">
      <Header />
      <EncodingSelector activeType={encodingType} onTypeChange={handleTypeChange} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col gap-5">
        {isLargeInput && (
          <div className="px-3 py-2 rounded-md bg-warning/10 border border-warning/30 text-warning text-xs">
            Large input detected (&gt;1 MB) — auto-transform is disabled. Use the buttons below to run manually.
          </div>
        )}

        <InputPanel
          value={input}
          onChange={setInput}
          onClear={handleClear}
          onPaste={handlePaste}
        />

        <ActionBar
          onEncode={handleEncode}
          onDecode={handleDecode}
          onSwap={handleSwap}
          autoMode={autoMode}
          onAutoModeToggle={() => setAutoMode(!autoMode)}
          disabled={!input}
        />

        <OutputPanel
          value={output}
          error={error}
          onCopy={handleCopy}
          onDownload={handleDownload}
          copied={copied}
        />

        <DetectionBanner
          detectedType={detectedType}
          activeType={encodingType}
          onUse={handleTypeChange}
        />

        <ShortcutHints />
      </main>

      <footer className="text-center text-xs text-text-muted py-4 border-t border-surface-700">
        All encoding/decoding happens in-browser — no data is sent to any server
      </footer>
    </div>
  )
}

