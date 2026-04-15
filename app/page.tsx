'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import FileUpload from '@/components/FileUpload'
import StudyContextForm from '@/components/StudyContextForm'
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
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Context' },
  { id: 3, label: 'Review' },
] as const

function badgeClass(type: UploadedFile['type']) {
  if (type === 'csv') return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  if (type === 'image') return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
  return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}

export default function Home() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [studyContext, setStudyContext] = useState<StudyContext>(initialStudyContext)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const canContinueFromUpload = uploadedFiles.length > 0
  const hasRequiredContext = Boolean(
    studyContext.title.trim() &&
      studyContext.population.trim() &&
      studyContext.primaryOutcome.trim() &&
      studyContext.statisticalMethods.trim()
  )
  const canGenerate = uploadedFiles.length > 0 && hasRequiredContext
  const generateTooltip =
    uploadedFiles.length === 0
      ? 'Upload at least one analysis file'
      : !hasRequiredContext
        ? 'Please fill in all required fields'
        : ''

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
        throw new Error('Failed to generate written narrative.')
      }

      const result: GenerateResponse = await response.json()
      sessionStorage.setItem('scribe_result', JSON.stringify(result))
      sessionStorage.setItem('scribe_context', JSON.stringify(studyContext))
      router.push('/results')
    } catch {
      setGenerateError('Generation failed — please try again')
      window.setTimeout(() => setGenerateError(null), 3500)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-slate-100 bg-white px-6 py-6 shadow-sm sm:px-8">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Scribe
            </h1>
            <p className="text-base text-slate-600">
              Turn your data outputs into polished written narrative — instantly
            </p>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              For researchers, analysts, consultants, and data scientists who have the numbers but
              need the words
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => {
              const isActive = currentStep === step.id
              const isComplete = currentStep > step.id

              return (
                <div
                  key={step.id}
                  className={cn(
                    'rounded-2xl border border-slate-100 px-4 py-4 transition-all duration-300',
                    isActive ? 'bg-slate-50 shadow-sm' : 'bg-white',
                    isComplete ? 'border-slate-200' : ''
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition',
                        isComplete || isActive
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-500'
                      )}
                    >
                      {step.id}
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Step {step.id}
                      </p>
                      <p className="text-lg font-semibold text-slate-900">{step.label}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </header>

        {generateError && (
          <div className="fixed right-6 top-6 z-50 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg">
            {generateError}
          </div>
        )}

        <section className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8">
          {currentStep === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">Step 1: Upload inputs</h2>
                <p className="text-sm leading-6 text-slate-600">
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
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Continue to study context
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">Step 2: Add study context</h2>
                <p className="text-sm leading-6 text-slate-600">
                  Provide the core context so Scribe can frame the written narrative for the right
                  audience and use case.
                </p>
              </div>

              <StudyContextForm context={studyContext} onChange={setStudyContext} />

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Back to upload
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!hasRequiredContext}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Review inputs
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fade-in space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-900">Step 3: Review</h2>
                <p className="text-sm leading-6 text-slate-600">
                  Confirm your uploaded files, tone, and selected sections before generating the
                  written narrative.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Files Uploaded
                    </h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                      {uploadedFiles.length} file{uploadedFiles.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {uploadedFiles.length > 0 ? (
                      uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="rounded-xl border border-slate-100 bg-white px-4 py-3"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="font-medium text-slate-900">{file.name}</p>
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
                      <p className="text-sm text-slate-500">No files uploaded yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Analysis Context
                  </h3>
                  <dl className="mt-4 space-y-4 rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-600">
                    <div>
                      <dt className="font-medium text-slate-900">Title</dt>
                      <dd>{studyContext.title || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Sample / Dataset Description</dt>
                      <dd>{studyContext.population || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Key Question or Outcome</dt>
                      <dd>{studyContext.primaryOutcome || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Methods Used</dt>
                      <dd>{studyContext.statisticalMethods || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Tone</dt>
                      <dd>{TONE_PRESETS[studyContext.outputTone].label}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Sections</dt>
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
                  className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-7 py-4 text-base font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isGenerating && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Written Narrative'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Back to context
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg text-slate-700">
              ^
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Upload</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Drop in CSV tables, figures, Excel exports, or pasted model output
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg text-slate-700">
              []
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Generate</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose your tone and sections — from Executive Summary to Methods to Recommendations
            </p>
          </article>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-lg text-slate-700">
              ...
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Refine</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Chat to iterate — add context, adjust tone, or incorporate new data
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
