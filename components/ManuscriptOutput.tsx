'use client'

import { useState } from 'react'
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'

import { ManuscriptSection, StudyContext } from '@/types'

interface ManuscriptOutputProps {
  sections: ManuscriptSection[]
  isLoading: boolean
  title: string
  outputStyle: StudyContext['journalStyle']
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 5.5h6" />
      <path d="M8 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M9 3h6v3H9z" />
    </svg>
  )
}

async function downloadDocx(
  sections: ManuscriptSection[],
  title: string,
  outputStyle: StudyContext['journalStyle']
) {
  const methodsHeading =
    outputStyle === 'Business' || outputStyle === 'Technical' ? 'Analytical Methods' : 'Methods'
  const resultsHeading =
    outputStyle === 'Business' || outputStyle === 'Technical' ? 'Key Findings' : 'Results'

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            text: methodsHeading,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [new TextRun(sections.find((s) => s.type === 'methods')?.content || '')],
          }),
          new Paragraph({
            text: resultsHeading,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [new TextRun(sections.find((s) => s.type === 'results')?.content || '')],
          }),
        ],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'scribe_manuscript.docx'
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function ManuscriptOutput({
  sections,
  isLoading,
  title,
  outputStyle,
}: ManuscriptOutputProps) {
  const [copiedSection, setCopiedSection] = useState<ManuscriptSection['type'] | null>(null)
  const animateKey = sections.map((section) => `${section.type}:${section.content.length}`).join('|')
  const useAnalyticalHeaders = outputStyle === 'Business' || outputStyle === 'Technical'

  async function handleCopy(section: ManuscriptSection) {
    await navigator.clipboard.writeText(section.content)
    setCopiedSection(section.type)
    window.setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Written Output
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-slate-900">
            Draft Narrative
          </h2>
        </div>

        <button
          type="button"
          onClick={() => void downloadDocx(sections, title || 'Scribe Narrative', outputStyle)}
          disabled={isLoading || sections.length === 0}
          className="rounded-full border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Download as .docx
        </button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="animate-pulse space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="h-6 w-28 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-11/12 rounded bg-slate-200" />
              <div className="h-4 w-10/12 rounded bg-slate-200" />
            </div>
            <div className="animate-pulse space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="h-6 w-28 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-11/12 rounded bg-slate-200" />
              <div className="h-4 w-10/12 rounded bg-slate-200" />
            </div>
          </div>
        ) : sections.length > 0 ? (
          <div key={animateKey} className="space-y-10 animate-fade-in">
            {sections.map((section) => (
              <section key={section.type}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl font-semibold text-slate-900">
                    {section.type === 'methods'
                      ? useAnalyticalHeaders
                        ? 'Analytical Methods'
                        : 'Methods'
                      : useAnalyticalHeaders
                        ? 'Key Findings'
                        : 'Results'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => void handleCopy(section)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <ClipboardIcon />
                    {copiedSection === section.type ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50 px-6 py-6">
                  <p className="whitespace-pre-wrap font-serif text-[1.05rem] leading-8 text-slate-800">
                    {section.content}
                  </p>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            Generated analytical narrative sections will appear here.
          </p>
        )}
      </div>
    </div>
  )
}
