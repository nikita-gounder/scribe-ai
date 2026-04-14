'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import FileUpload from '@/components/FileUpload'
import StudyContextForm from '@/components/StudyContextForm'
import { cn } from '@/lib/utils'
import { GenerateResponse, StudyContext, UploadedFile } from '@/types'

const initialStudyContext: StudyContext = {
  title: '',
  population: '',
  primaryOutcome: '',
  statisticalMethods: '',
  journalStyle: 'APA',
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
        throw new Error('Failed to generate manuscript sections.')
      }

      const result: GenerateResponse = await response.json()
      sessionStorage.setItem('scribe_result', JSON.stringify(result))
      sessionStorage.setItem('scribe_context', JSON.stringify(studyContext))
      router.push('/results')
    } catch {
      setGenerateError('Generation failed. Please check your API key and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-sm">
          <div className="flex flex-col gap-8">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
                Scribe
              </span>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  Transform analysis outputs into manuscript-ready Methods and Results.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Upload tables, figures, and model summaries, add concise study context, and
                  prepare your manuscript draft in a guided three-step workflow.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step) => {
                const isActive = currentStep === step.id
                const isComplete = currentStep > step.id

                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl border px-4 py-4 transition ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : isComplete
                          ? 'border-slate-300 bg-slate-100 text-slate-700'
                          : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.2em]">
                      Step {step.id}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{step.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-950">Step 1: Upload inputs</h2>
                <p className="text-sm leading-6 text-slate-600">
                  Add CSV tables, image files, or pasted statistical output to start building the
                  study package that Scribe will use for drafting.
                </p>
              </div>

              <FileUpload files={uploadedFiles} onFilesChange={setUploadedFiles} />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!canContinueFromUpload}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Continue to study context
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-950">Step 2: Add study context</h2>
                <p className="text-sm leading-6 text-slate-600">
                  Provide the core study details so Scribe can frame the manuscript text in the
                  correct academic style.
                </p>
              </div>

              <StudyContextForm context={studyContext} onChange={setStudyContext} />

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Back to upload
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  disabled={!hasRequiredContext}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Review inputs
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-950">Step 3: Review</h2>
                <p className="text-sm leading-6 text-slate-600">
                  Confirm your uploaded files and study metadata before generating manuscript
                  sections.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
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
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3"
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

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Study Context
                  </h3>
                  <dl className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
                    <div>
                      <dt className="font-medium text-slate-900">Title</dt>
                      <dd>{studyContext.title || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Population</dt>
                      <dd>{studyContext.population || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Primary Outcome</dt>
                      <dd>{studyContext.primaryOutcome || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Statistical Methods</dt>
                      <dd>{studyContext.statisticalMethods || 'Not provided'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-900">Journal Style</dt>
                      <dd>{studyContext.journalStyle}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {generateError && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {generateError}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Back to context
                </button>

                <button
                  type="button"
                  onClick={() => void handleGenerate()}
                  disabled={!canGenerate || isGenerating}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 px-7 py-4 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isGenerating && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate Manuscript Sections'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
