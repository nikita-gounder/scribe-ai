'use client'

import { OUTPUT_SECTION_LABELS, OutputSection, StudyContext, TONE_PRESETS } from '@/types'

interface StudyContextFormProps {
  context: StudyContext
  onChange: (context: StudyContext) => void
}

const toneCards = [
  {
    tone: 'academic' as const,
    icon: '🎓',
    label: 'Academic',
    description: 'Formal prose, APA/AMA statistical reporting',
  },
  {
    tone: 'business' as const,
    icon: '📊',
    label: 'Business',
    description: 'Clear, direct prose for stakeholder audiences',
  },
  {
    tone: 'technical' as const,
    icon: '⚙️',
    label: 'Technical',
    description: 'Precise, methods-forward for data science teams',
  },
]

const sectionOptions: OutputSection[] = [
  'methods',
  'results',
  'approach',
  'findings',
  'executive_summary',
  'discussion',
  'recommendations',
  'limitations',
]

export default function StudyContextForm({ context, onChange }: StudyContextFormProps) {
  function handleToneChange(tone: StudyContext['outputTone']) {
    onChange({
      ...context,
      outputTone: tone,
      outputSections: [...TONE_PRESETS[tone].defaultSections],
    })
  }

  function toggleSection(section: OutputSection) {
    const isSelected = context.outputSections.includes(section)

    if (isSelected && context.outputSections.length === 1) {
      return
    }

    onChange({
      ...context,
      outputSections: isSelected
        ? context.outputSections.filter((item) => item !== section)
        : [...context.outputSections, section],
    })
  }

  return (
    <div className="space-y-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-7">
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
      </div>

      <div className="grid gap-5 md:grid-cols-2">
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
          <span className="font-medium text-slate-900">Methods Used</span>
          <input
            value={context.statisticalMethods}
            onChange={(event) => onChange({ ...context, statisticalMethods: event.target.value })}
            placeholder="e.g. Logistic regression, A/B test, ROC analysis, time series forecasting, linear mixed model"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-900">Tone</h3>
          <p className="text-sm text-slate-600">
            Choose a writing preset and we&apos;ll suggest the default sections below.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {toneCards.map((toneCard) => {
            const isActive = context.outputTone === toneCard.tone

            return (
              <button
                key={toneCard.tone}
                type="button"
                onClick={() => handleToneChange(toneCard.tone)}
                className={`rounded-2xl border bg-white px-5 py-5 text-left transition ${
                  isActive
                    ? 'border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="text-2xl">{toneCard.icon}</div>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-slate-900">{toneCard.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{toneCard.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-900">Sections to generate</h3>
          <p className="text-sm text-slate-600">
            Customize the exact sections Scribe should write. At least one section must stay
            selected.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {sectionOptions.map((section) => {
            const isSelected = context.outputSections.includes(section)

            return (
              <button
                key={section}
                type="button"
                onClick={() => toggleSection(section)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                {OUTPUT_SECTION_LABELS[section]}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
