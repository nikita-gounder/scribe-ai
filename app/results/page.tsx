'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import IterationPanel from '@/components/IterationPanel'
import ManuscriptOutput from '@/components/ManuscriptOutput'
import {
  GenerateResponse,
  IterationMessage,
  ManuscriptSection,
  OUTPUT_SECTION_LABELS,
  StudyContext,
  TONE_PRESETS,
} from '@/types'

const emptyContext: StudyContext = {
  title: '',
  population: '',
  primaryOutcome: '',
  statisticalMethods: '',
  outputTone: 'academic',
  outputSections: [...TONE_PRESETS.academic.defaultSections],
}

export default function ResultsPage() {
  const router = useRouter()
  const [sections, setSections] = useState<ManuscriptSection[]>([])
  const [context, setContext] = useState<StudyContext>(emptyContext)
  const [messages, setMessages] = useState<IterationMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isIterating, setIsIterating] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
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

      setMessages([])
      setIsLoading(false)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && sections.length > 0) {
      const storedResult = sessionStorage.getItem('scribe_result')
      const parsedResult: GenerateResponse | null = storedResult ? JSON.parse(storedResult) : null

      sessionStorage.setItem(
        'scribe_result',
        JSON.stringify({
          sections,
          conversationId: parsedResult?.conversationId || crypto.randomUUID(),
        })
      )
    }
  }, [isLoading, sections])

  function handleStartOver() {
    sessionStorage.removeItem('scribe_result')
    sessionStorage.removeItem('scribe_context')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] px-6 py-8 text-[var(--text-primary)] lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-5 shadow-sm sm:px-8">
          <div className="space-y-1">
            <Link
              href="/"
              className="font-serif text-3xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Scribe
            </Link>
            <p className="text-sm text-[var(--text-secondary)]">
              Turn your data outputs into polished written narrative — instantly
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartOver}
            className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]"
          >
            Start Over
          </button>
        </header>

        {!isLoading && sections.length === 0 ? (
          <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-8 py-10 shadow-sm">
            <h2 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">
              No written draft found
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              Generate a draft from the home page first, then return here to review and refine it.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)]"
            >
              Return to home
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Analysis Context
                </p>
                <dl className="mt-4 grid gap-4 text-sm text-[var(--text-secondary)] sm:grid-cols-2">
                  <div>
                    <dt className="font-medium text-[var(--text-primary)]">Title</dt>
                    <dd>{context.title || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--text-primary)]">Tone</dt>
                    <dd>{TONE_PRESETS[context.outputTone].label}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--text-primary)]">Sample / Dataset Description</dt>
                    <dd>{context.population || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-[var(--text-primary)]">Key Question or Outcome</dt>
                    <dd>{context.primaryOutcome || 'Not provided'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-[var(--text-primary)]">Methods Used</dt>
                    <dd>{context.statisticalMethods || 'Not provided'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-[var(--text-primary)]">Requested Sections</dt>
                    <dd>
                      {context.outputSections
                        .map((section) => OUTPUT_SECTION_LABELS[section])
                        .join(', ')}
                    </dd>
                  </div>
                </dl>
              </div>

              <ManuscriptOutput
                sections={sections}
                isLoading={isLoading}
                title={context.title || 'Scribe Narrative'}
                outputTone={context.outputTone}
              />
            </div>

            <IterationPanel
              context={context}
              messages={messages}
              originalSections={sections}
              onMessagesChange={setMessages}
              onSectionsUpdate={setSections}
              isLoading={isIterating}
              onLoadingChange={setIsIterating}
            />
          </div>
        )}
      </div>
    </main>
  )
}
