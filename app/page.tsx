'use client'

import Link from 'next/link'
import { useState } from 'react'

import FileUpload from '@/components/FileUpload'
import StudyContextForm from '@/components/StudyContextForm'
import { StudyContext, UploadedFile } from '@/types'

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

export default function Home() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [studyContext, setStudyContext] = useState<StudyContext>(initialStudyContext)
  const [isGenerating, setIsGenerating] = useState(false)

  const canContinueFromUpload = uploadedFiles.length > 0
  const canContinueFromContext =
    studyContext.title.trim() &&
    studyContext.population.trim() &&
    studyContext.primaryOutcome.trim() &&
    studyContext.statisticalMethods.trim()

  async function handleGenerate() {
    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
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
                  disabled={!canContinueFromContext}
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
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Uploaded Files
                  </h3>
                  <div className="mt-4 space-y-3">
                    {uploadedFiles.length > 0 ? (
                      uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                        >
                          <p className="font-medium text-slate-900">{file.name}</p>
                          <p className="text-sm text-slate-500">{file.type.toUpperCase()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No files uploaded yet.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Study Summary
                  </h3>
                  <dl className="mt-4 space-y-4 text-sm text-slate-600">
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

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Back to context
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Manuscript Sections'}
                  </button>
                  <Link
                    href="/results"
                    className="rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Open results page
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
