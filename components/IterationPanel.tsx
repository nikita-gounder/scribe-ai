'use client'

import { FormEvent, useState } from 'react'

import { IterationMessage } from '@/types'

interface IterationPanelProps {
  messages: IterationMessage[]
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export default function IterationPanel({
  messages,
  onSendMessage,
  isLoading,
}: IterationPanelProps) {
  const [draft, setDraft] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!draft.trim() || isLoading) return

    onSendMessage(draft.trim())
    setDraft('')
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Iteration Panel
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Refine the Draft</h2>
        </div>
        {isLoading && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Thinking
          </span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {message.role}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{message.content}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500">Iteration Panel — Refine your output here</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t border-slate-200 pt-6">
        <label className="block">
          <span className="text-sm font-medium text-slate-900">Revision Request</span>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder='e.g. Make the Results section more concise and emphasize the ROC findings.'
            className="mt-2 min-h-28 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading || !draft.trim()}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? 'Sending...' : 'Send refinement request'}
        </button>
      </form>
    </div>
  )
}
