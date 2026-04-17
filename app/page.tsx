'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowDown,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  Cpu,
  Feather,
  Sparkles,
  FlaskConical,
  MessageSquare,
  Settings2,
  Upload,
  X,
} from 'lucide-react'

import FileUpload from '@/components/FileUpload'
import StudyContextForm from '@/components/StudyContextForm'
import { DEMO_PRESETS, DemoPreset } from '@/lib/demos'
import { cn } from '@/lib/utils'
import {
  GenerateResponse,
  OUTPUT_SECTION_LABELS,
  StudyContext,
  TONE_PRESETS,
  UploadedFile,
} from '@/types'

const initialStudyContext: StudyContext = {
  title: '',
  population: '',
  primaryOutcome: '',
  statisticalMethods: '',
  outputTone: 'academic',
  outputSections: [...TONE_PRESETS.academic.defaultSections],
}

const steps = [
  {
    id: 1,
    label: '01 — Upload',
    description: 'Drop in CSV tables, figures, Excel exports, or pasted model output',
    icon: Upload,
  },
  {
    id: 2,
    label: '02 — Context',
    description: 'Set your tone and sections — get a polished narrative instantly',
    icon: Settings2,
  },
  {
    id: 3,
    label: '03 — Refine',
    description: 'Chat to iterate — add context, adjust tone, or incorporate new data',
    icon: MessageSquare,
  },
] as const

function badgeClass(type: UploadedFile['type']) {
  if (type === 'csv') {
    return 'bg-[var(--accent-subtle)] text-[var(--accent)] ring-1 ring-[var(--border-subtle)]'
  }

  if (type === 'image') {
    return 'bg-[var(--bg-primary)] text-[var(--text-secondary)] ring-1 ring-[var(--border-subtle)]'
  }

  return 'bg-[var(--bg-primary)] text-[var(--text-secondary)] ring-1 ring-[var(--border-subtle)]'
}

export default function Home() {
  const router = useRouter()
  const formSectionRef = useRef<HTMLElement>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [studyContext, setStudyContext] = useState<StudyContext>(initialStudyContext)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [showDemoBanner, setShowDemoBanner] = useState(false)

  function loadDemoPreset(preset: DemoPreset) {
    setUploadedFiles(preset.files.map((file) => ({ ...file })))
    setStudyContext({ ...preset.context, outputSections: [...preset.context.outputSections] })
    setCurrentStep(3)
    setGenerateError(null)
    setShowDemoBanner(true)

    window.requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function resetToScratch() {
    setUploadedFiles([])
    setStudyContext(initialStudyContext)
    setCurrentStep(1)
    setGenerateError(null)
    setShowDemoBanner(false)

    window.requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const canContinueFromUpload = uploadedFiles.length > 0
  const hasRequiredContext = Boolean(
    studyContext.title.trim() && studyContext.primaryOutcome.trim()
  )
  const canGenerate = uploadedFiles.length > 0 && hasRequiredContext
  const generateTooltip =
    uploadedFiles.length === 0
      ? 'Upload at least one analysis file'
      : !hasRequiredContext
        ? 'Please fill in all required fields'
        : ''

  function showGenerateError(status?: number) {
    if (status === 429) {
      setGenerateError("You've reached the usage limit. Please try again in an hour.")
    } else if (status === 504) {
      setGenerateError('Generation timed out — please try again.')
    } else {
      setGenerateError('Something went wrong — please try again.')
    }

    window.setTimeout(() => setGenerateError(null), 3500)
  }

  async function handleGenerate() {
    if (!canGenerate || isGenerating) return

    setIsGenerating(true)
    setGenerateError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: uploadedFiles,
          context: studyContext,
        }),
      })

      if (!response.ok) {
        showGenerateError(response.status)
        return
      }

      const result: GenerateResponse = await response.json()
      sessionStorage.setItem('scribe_result', JSON.stringify(result))
      sessionStorage.setItem('scribe_context', JSON.stringify(studyContext))
      router.push('/results')
    } catch {
      showGenerateError()
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 py-8 lg:px-10">
        <header className="pb-6 pt-24">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <Feather size={48} className="text-[var(--accent)]" strokeWidth={1.5} />
              <h1 className="font-serif text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-6xl">
                Scribe
              </h1>
            </div>

            <p className="max-w-[780px] text-xl font-medium text-[var(--text-secondary)]">
              Instantly turn your data outputs into a polished written narrative.
            </p>

            <p className="text-base text-[var(--text-muted)]">
              For researchers, analysts, consultants, and data scientists who have the numbers but
              need the words.
            </p>
          </div>
        </header>

        <div className="relative">
          <div className="absolute left-[16.666%] right-[16.666%] top-5 hidden border-t border-[var(--border-subtle)] lg:block" />
          <div className="flex flex-col gap-3 md:flex-row">
            {steps.map((step) => {
              const isActive = currentStep === step.id
              const isComplete = currentStep > step.id
              const Icon = isComplete ? CheckCircle2 : step.icon
              const iconClass =
                isComplete || isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
              const labelClass =
                isActive || isComplete ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'

              return (
                <div
                  key={step.id}
                  className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 md:flex-1"
                >
                  <div className={cn('mb-2.5 flex items-center gap-2.5', iconClass)}>
                    <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                    <p className={cn('text-sm font-semibold', labelClass)}>{step.label}</p>
                  </div>
                  <p className="text-xs leading-5 text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)]" />

        {generateError && (
          <div className="fixed right-6 top-6 z-50 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg">
            {generateError}
          </div>
        )}

        <section className="space-y-8 rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm sm:p-8">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[var(--text-primary)]">See it in action</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {DEMO_PRESETS.map((preset) => {
                const Icon =
                  preset.id === 'academic'
                    ? FlaskConical
                    : preset.id === 'business'
                      ? BarChart2
                      : Cpu

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => loadDemoPreset(preset)}
                    className="flex h-full min-h-[122px] flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-[var(--text-primary)]">
                          {preset.label}
                        </p>
                        <p className="mt-1.5 max-w-[22ch] text-xs leading-5 text-[var(--text-secondary)]">
                          {preset.description}
                        </p>
                      </div>
                      <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] p-1.5 text-[var(--accent)]">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
                      </span>
                    </div>
                    <p className="mt-auto pt-3 text-xs font-medium text-[var(--accent)]">
                      Try this demo →
                    </p>
                  </button>
                )
              })}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={resetToScratch}
                className="text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
              >
                Or start with your own data →
              </button>
            </div>
          </div>

          <section
            ref={formSectionRef}
            className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 shadow-sm transition-all duration-300 sm:p-8"
          >
            {currentStep === 1 && (
              <div className="animate-fade-in space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                    Step 1: Upload inputs
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    Add CSV tables, image files, or pasted analytical output to start building the
                    context package that Scribe will use for drafting.
                  </p>
                </div>

                <FileUpload files={uploadedFiles} onFilesChange={setUploadedFiles} />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!canContinueFromUpload}
                    className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--text-muted)]"
                  >
                    Continue to study context
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-fade-in space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                    Step 2: Add study context
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    Provide the core context so Scribe can frame the written narrative for the right
                    audience and use case.
                  </p>
                </div>

                <StudyContextForm context={studyContext} onChange={setStudyContext} />

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]"
                  >
                    Back to upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!hasRequiredContext}
                    className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--text-muted)]"
                  >
                    Review inputs
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-fade-in space-y-6">
                {showDemoBanner && (
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--accent-subtle)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                    <p>Using demo data — click Generate to see Scribe in action</p>
                    <button
                      type="button"
                      onClick={() => setShowDemoBanner(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      aria-label="Dismiss demo data banner"
                    >
                      <X className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                    Step 3: Review
                  </h2>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    Confirm your uploaded files, tone, and selected sections before generating the
                    written narrative.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        Files Uploaded
                      </h3>
                      <span className="rounded-full bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] ring-1 ring-[var(--border-subtle)]">
                        {uploadedFiles.length} file{uploadedFiles.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {uploadedFiles.length > 0 ? (
                        uploadedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <p className="font-medium text-[var(--text-primary)]">{file.name}</p>
                              <span
                                className={cn(
                                  'inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]',
                                  badgeClass(file.type)
                                )}
                              >
                                {file.type}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[var(--text-muted)]">No files uploaded yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      Analysis Context
                    </h3>
                    <dl className="mt-4 space-y-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 text-sm text-[var(--text-secondary)]">
                      <div>
                        <dt className="font-medium text-[var(--text-primary)]">Title</dt>
                        <dd>{studyContext.title || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[var(--text-primary)]">
                          Sample / Dataset Description
                        </dt>
                        <dd>{studyContext.population || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[var(--text-primary)]">
                          Key Question or Outcome
                        </dt>
                        <dd>{studyContext.primaryOutcome || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[var(--text-primary)]">Methods Used</dt>
                        <dd>{studyContext.statisticalMethods || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[var(--text-primary)]">Tone</dt>
                        <dd>{TONE_PRESETS[studyContext.outputTone].label}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-[var(--text-primary)]">Sections</dt>
                        <dd>
                          {studyContext.outputSections
                            .map((section) => OUTPUT_SECTION_LABELS[section])
                            .join(', ')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => void handleGenerate()}
                    disabled={!canGenerate || isGenerating}
                    title={generateTooltip}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--accent)] px-7 py-4 text-base font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--text-muted)]"
                  >
                    {isGenerating && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {isGenerating ? 'Generating...' : 'Generate Written Narrative'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]"
                  >
                    Back to context
                  </button>
                </div>
              </div>
            )}
          </section>
        </section>

        <section className="grid gap-10 border-t border-[var(--border-subtle)] py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-[var(--accent)]">
              <Sparkles className="h-4 w-4" strokeWidth={1.8} />
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                WHY SCRIBE EXISTS
              </p>
            </div>
            <h2 className="max-w-[480px] text-2xl font-semibold text-[var(--text-primary)]">
              The analysis is done. Writing it up shouldn&apos;t take hours.
            </h2>
            <p className="max-w-[520px] text-base leading-relaxed text-[var(--text-secondary)]">
              Scribe was built out of a real frustration: staring at R model outputs and
              regression tables, knowing exactly what the data shows, but facing hours of
              translating it into text. Whether you&apos;re a grad student finishing a manuscript,
              a consultant writing up findings, or a data scientist documenting an experiment,
              Scribe gets you from numbers to narrative in seconds.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                INPUT
              </p>
              <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border-subtle)]">
                <div className="grid grid-cols-[1.6fr_1fr] bg-[var(--bg-primary)] px-3 py-2 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  <span>Biomarker</span>
                  <span>p-val</span>
                </div>
                {[
                  ['GFAP', '<.001'],
                  ['NfL', '<.001'],
                  ['pTau181', '<.001'],
                  ['Aβ42', '<.001'],
                ].map((row, index) => (
                  <div
                    key={row[0]}
                    className={cn(
                      'grid grid-cols-[1.6fr_1fr] border-t border-[var(--border-subtle)] px-3 py-3 text-sm text-[var(--text-primary)]',
                      index % 2 === 0 ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-card)]'
                    )}
                  >
                    <span>{row[0]}</span>
                    <span className="font-mono">{row[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center text-[var(--accent)]">
              <ArrowRight className="hidden h-7 w-7 md:block" strokeWidth={2} />
              <ArrowDown className="h-7 w-7 md:hidden" strokeWidth={2} />
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                OUTPUT
              </p>
              <div className="relative mt-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-4 overflow-hidden">
                <div className="border-l-2 border-[var(--accent)] pl-3">
                  <p className="whitespace-pre-wrap font-serif text-sm leading-6 text-[var(--text-primary)]">
                    Glial fibrillary acidic protein (GFAP) demonstrated{'\n'}
                    a significant positive association with disease
                  </p>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[var(--bg-card)]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
