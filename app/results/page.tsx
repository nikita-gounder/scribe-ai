'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Document, Packer, Paragraph, TextRun } from 'docx'

import IterationPanel from '@/components/IterationPanel'
import ManuscriptOutput from '@/components/ManuscriptOutput'
import { GenerateResponse, IterationMessage, ManuscriptSection, StudyContext } from '@/types'

const emptyContext: StudyContext = {
  title: '',
  population: '',
  primaryOutcome: '',
  statisticalMethods: '',
  journalStyle: 'APA',
}

export default function ResultsPage() {
  const router = useRouter()
  const [sections, setSections] = useState<ManuscriptSection[]>([])
  const [context, setContext] = useState<StudyContext>(emptyContext)
  const [messages, setMessages] = useState<IterationMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isIterating, setIsIterating] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('scribe_result')
    const storedContext = sessionStorage.getItem('scribe_context')

    if (storedResult) {
      const parsedResult: GenerateResponse = JSON.parse(storedResult)
      setSections(parsedResult.sections)
    }

    if (storedContext) {
      const parsedContext: StudyContext = JSON.parse(storedContext)
      setContext(parsedContext)
    }

    setMessages([
      {
        role: 'assistant',
        content:
          'Your manuscript draft is ready. Use the panel below to request revisions once the iterate endpoint is implemented.',
      },
    ])
    setIsLoading(false)
  }, [])

  async function handleDownload() {
    try {
      setDownloadError(null)

      const methods = sections.find((section) => section.type === 'methods')?.content ?? ''
      const results = sections.find((section) => section.type === 'results')?.content ?? ''

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [new TextRun({ text: context.title || 'Scribe Manuscript Draft', bold: true })],
                heading: 'Title',
              }),
              new Paragraph({
                children: [new TextRun({ text: 'Methods', bold: true })],
                heading: 'Heading1',
              }),
              ...methods.split('\n').filter(Boolean).map((line) => new Paragraph(line)),
              new Paragraph({
                children: [new TextRun({ text: 'Results', bold: true })],
                heading: 'Heading1',
              }),
              ...results.split('\n').filter(Boolean).map((line) => new Paragraph(line)),
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${(context.title || 'scribe-manuscript').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.docx`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setDownloadError('Unable to generate the .docx file.')
    }
  }

  async function handleSendMessage(message: string) {
    setIsIterating(true)
    setMessages((current) => [...current, { role: 'user', content: message }])

    try {
      const response = await fetch('/api/iterate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sections,
          context,
        }),
      })

      let assistantMessage = 'Iteration endpoint not implemented yet.'

      if (response.ok) {
        const data = await response.json()
        assistantMessage = data.error || assistantMessage
      } else {
        const data = await response.json().catch(() => ({ error: 'Not implemented' }))
        assistantMessage = data.error || assistantMessage
      }

      setMessages((current) => [...current, { role: 'assistant', content: assistantMessage }])
    } catch {
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: 'Unable to reach the iteration endpoint right now.' },
      ])
    } finally {
      setIsIterating(false)
    }
  }

  function handleStartOver() {
    sessionStorage.removeItem('scribe_result')
    sessionStorage.removeItem('scribe_context')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
              Results Workspace
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Methods and Results draft
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              Review the generated manuscript sections, copy individual sections, export a Word
              document, or queue refinements for the next iteration.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleDownload()}
              disabled={isLoading || sections.length === 0}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Download as .docx
            </button>
            <button
              type="button"
              onClick={handleStartOver}
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Start Over
            </button>
          </div>
        </div>

        {downloadError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {downloadError}
          </div>
        )}

        {!isLoading && sections.length === 0 && (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">No manuscript draft found</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Generate a draft from the home page first, then return here to review and export it.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Return to home
            </Link>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Study Context
              </p>
              <dl className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <dt className="font-medium text-slate-900">Title</dt>
                  <dd>{context.title || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Journal Style</dt>
                  <dd>{context.journalStyle}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Population</dt>
                  <dd>{context.population || 'Not provided'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-900">Primary Outcome</dt>
                  <dd>{context.primaryOutcome || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-medium text-slate-900">Statistical Methods Used</dt>
                  <dd>{context.statisticalMethods || 'Not provided'}</dd>
                </div>
              </dl>
            </div>

            <ManuscriptOutput sections={sections} isLoading={isLoading} />

            <IterationPanel
              messages={messages}
              onSendMessage={(message) => void handleSendMessage(message)}
              isLoading={isIterating}
            />
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Working Notes
            </p>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-600">
              <p>
                Copy buttons are available inside each manuscript section so you can move Methods
                and Results independently into your draft.
              </p>
              <p>
                The iteration endpoint is currently stubbed, so refinement requests will return a
                placeholder response until that route is implemented.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
