'use client'

import { StudyContext } from '@/types'

interface StudyContextFormProps {
  context: StudyContext
  onChange: (context: StudyContext) => void
}

export default function StudyContextForm({ context, onChange }: StudyContextFormProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Step 2</p>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Study Title</span>
          <input
            value={context.title}
            onChange={(event) => onChange({ ...context, title: event.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            placeholder="CSF Biomarkers and Clinical Outcomes"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Population</span>
          <input
            value={context.population}
            onChange={(event) => onChange({ ...context, population: event.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            placeholder="Adults with frontotemporal dementia"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Primary Outcome</span>
          <input
            value={context.primaryOutcome}
            onChange={(event) => onChange({ ...context, primaryOutcome: event.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
            placeholder="Diagnostic classification performance"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Journal Style</span>
          <select
            value={context.journalStyle}
            onChange={(event) =>
              onChange({
                ...context,
                journalStyle: event.target.value as StudyContext['journalStyle'],
              })
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
          >
            <option value="APA">APA</option>
            <option value="AMA">AMA</option>
            <option value="Nature">Nature</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-700">
        <span className="font-medium text-slate-900">Statistical Methods Used</span>
        <textarea
          value={context.statisticalMethods}
          onChange={(event) => onChange({ ...context, statisticalMethods: event.target.value })}
          className="min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500"
          placeholder="Linear models, ROC analysis, survival models, mixed-effects regression..."
        />
      </label>
    </div>
  )
}
