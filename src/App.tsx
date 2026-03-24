import { useState } from 'react'
import { Header } from './components/Header'

type Mode = 'encode' | 'decode'

interface SectionState {
  input: string
  output: string
  error: string
  copied: boolean
}

function useCopyTimeout() {
  const [copied, setCopied] = useState(false)
  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return { copied, copy }
}

function EncodingSection({
  title,
  encode,
  decode,
}: {
  title: string
  encode: (s: string) => string
  decode: (s: string) => string
}) {
  const [state, setState] = useState<SectionState>({ input: '', output: '', error: '', copied: false })
  const { copied, copy } = useCopyTimeout()

  const run = (mode: Mode) => {
    if (!state.input) return
    try {
      const output = mode === 'encode' ? encode(state.input) : decode(state.input)
      setState(s => ({ ...s, output, error: '' }))
    } catch (e) {
      setState(s => ({ ...s, output: '', error: (e as Error).message }))
    }
  }

  return (
    <section className="bg-surface-800 border border-surface-700 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-700">
        <h2 className="text-text-primary font-semibold text-sm">{title}</h2>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <textarea
          className="min-h-[100px] bg-surface-700 border border-surface-600 rounded-md p-3
                     font-mono text-sm text-text-primary placeholder-text-muted
                     focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent
                     resize-none w-full"
          placeholder="Paste text here…"
          value={state.input}
          onChange={e => setState(s => ({ ...s, input: e.target.value, output: '', error: '' }))}
          spellCheck={false}
        />

        <div className="flex gap-2">
          <button
            onClick={() => run('encode')}
            disabled={!state.input}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-accent hover:bg-accent-hover text-surface-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Encode
          </button>
          <button
            onClick={() => run('decode')}
            disabled={!state.input}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-surface-700 hover:bg-surface-600 text-text-primary border border-surface-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Decode
          </button>
        </div>

        {state.error && (
          <p className="text-danger text-xs bg-danger/10 border border-danger/30 rounded px-3 py-2">
            {state.error}
          </p>
        )}

        {state.output && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs uppercase tracking-wider">Output</span>
              <button
                onClick={() => copy(state.output)}
                className="text-xs text-text-secondary hover:text-accent transition-colors cursor-pointer"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="bg-surface-700 border border-surface-600 rounded-md p-3 font-mono text-sm text-text-primary break-all">
              {state.output}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        <EncodingSection
          title="Base64"
          encode={s => btoa(unescape(encodeURIComponent(s)))}
          decode={s => decodeURIComponent(escape(atob(s)))}
        />

        <EncodingSection
          title="URL Encoding"
          encode={s => encodeURIComponent(s)}
          decode={s => decodeURIComponent(s)}
        />

        <p className="text-text-muted text-xs text-center">
          All encoding/decoding happens in-browser — no data is sent to any server
        </p>
      </main>
    </div>
  )
}
