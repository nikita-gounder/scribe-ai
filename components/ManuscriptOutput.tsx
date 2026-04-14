'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { ManuscriptSection } from '@/types'

interface ManuscriptOutputProps {
  sections: ManuscriptSection[]
  isLoading: boolean
}

function formatSectionTitle(type: ManuscriptSection['type']) {
  return type === 'methods' ? 'Methods' : 'Results'
}

export default function ManuscriptOutput({ sections, isLoading }: ManuscriptOutputProps) {
  const [copiedSection, setCopiedSection] = useState<ManuscriptSection['type'] | null>(null)

  async function handleCopy(section: ManuscriptSection) {
    await navigator.clipboard.writeText(section.content)
    setCopiedSection(section.type)
    window.setTimeout(() => setCopiedSection(null), 1800)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Manuscript Output
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Generated Sections</h2>
        </div>
        {isLoading && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Generating
          </span>
        )}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-6">
            <div className="animate-pulse space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="h-5 w-24 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-11/12 rounded bg-slate-200" />
              <div className="h-4 w-10/12 rounded bg-slate-200" />
            </div>
            <div className="animate-pulse border-t border-slate-200 pt-6">
              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="h-5 w-24 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-11/12 rounded bg-slate-200" />
                <div className="h-4 w-10/12 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ) : sections.length > 0 ? (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <section
                key={section.type}
                className={cn(index > 0 ? 'border-t border-slate-200 pt-6' : '')}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl font-semibold text-slate-950">
                    {formatSectionTitle(section.type)}
                  </h3>
                  <button
                    type="button"
                    onClick={() => void handleCopy(section)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    {copiedSection === section.type ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="whitespace-pre-wrap font-serif text-[1.05rem] leading-8 text-slate-700">
                    {section.content}
                  </p>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">Manuscript Output — Results will appear here</p>
        )}
      </div>
    </div>
  )
}
