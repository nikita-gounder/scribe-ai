'use client'

import { ManuscriptSection } from '@/types'

interface ManuscriptOutputProps {
  sections: ManuscriptSection[]
  isLoading: boolean
}

export default function ManuscriptOutput({ sections, isLoading }: ManuscriptOutputProps) {
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

      <div className="mt-6 space-y-4">
        {sections.length > 0 ? (
          sections.map((section) => (
            <section key={section.type} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                {section.type}
              </h3>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {section.content}
              </p>
            </section>
          ))
        ) : (
          <p className="text-slate-500">Manuscript Output — Results will appear here</p>
        )}
      </div>
    </div>
  )
}
