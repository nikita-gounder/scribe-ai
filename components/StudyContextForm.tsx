'use client'

import { StudyContext } from '@/types'

interface StudyContextFormProps {
  context: StudyContext
  onChange: (context: StudyContext) => void
}

export default function StudyContextForm({ context, onChange }: StudyContextFormProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Step 2</p>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">
            Analysis Title <span className="text-rose-500">*</span>
          </span>
          <input
            required
            value={context.title}
            onChange={(event) => onChange({ ...context, title: event.target.value })}
            placeholder="e.g. Churn Drivers in Q3 Enterprise Accounts"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Sample / Dataset Description</span>
          <input
            value={context.population}
            onChange={(event) => onChange({ ...context, population: event.target.value })}
            placeholder="e.g. Q3 customer cohort, clinical trial participants, loan applicants aged 25-60"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Key Question or Outcome</span>
          <input
            value={context.primaryOutcome}
            onChange={(event) => onChange({ ...context, primaryOutcome: event.target.value })}
            placeholder="e.g. Predict 30-day churn, classify high-risk patients, identify revenue drivers"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Output Style</span>
          <select
            value={context.journalStyle}
            onChange={(event) =>
              onChange({
                ...context,
                journalStyle: event.target.value as StudyContext['journalStyle'],
              })
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
          >
            <option value="APA">APA (Academic)</option>
            <option value="AMA">AMA (Medical)</option>
            <option value="Nature">Nature (Scientific)</option>
            <option value="Business">Business</option>
            <option value="Technical">Technical</option>
          </select>
        </label>
      </div>

      <label className="block space-y-2 text-sm text-slate-700">
        <span className="font-medium text-slate-900">Methods Used</span>
        <textarea
          value={context.statisticalMethods}
          onChange={(event) => onChange({ ...context, statisticalMethods: event.target.value })}
          placeholder="e.g. Logistic regression, A/B test, ROC analysis, time series forecasting, linear mixed model"
          className="min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
        />
      </label>
    </div>
  )
}
