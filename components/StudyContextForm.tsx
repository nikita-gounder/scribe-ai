'use client'

import {
  OUTPUT_SECTION_DESCRIPTIONS,
  OUTPUT_SECTION_LABELS,
  OutputSection,
  StudyContext,
  TONE_PRESETS,
} from '@/types'

interface StudyContextFormProps {
  context: StudyContext
  onChange: (context: StudyContext) => void
}

function AcademicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m3 9 9-5 9 5-9 5-9-5Z" />
      <path d="M7 11.5V15c0 1.8 2.2 3.5 5 3.5s5-1.7 5-3.5v-3.5" />
    </svg>
  )
}

function BusinessIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19.5h16" />
      <path d="M7 16V10" />
      <path d="M12 16V6" />
      <path d="M17 16v-3" />
    </svg>
  )
}

function TechnicalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3.5v4" />
      <path d="M12 16.5v4" />
      <path d="m4.9 7.9 2.8 2.8" />
      <path d="m16.3 13.3 2.8 2.8" />
      <path d="M3.5 12h4" />
      <path d="M16.5 12h4" />
      <path d="m4.9 16.1 2.8-2.8" />
      <path d="m16.3 10.7 2.8-2.8" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  )
}

const toneCards = [
  {
    tone: 'academic' as const,
    icon: <AcademicIcon />,
    label: 'Academic',
    description: 'Formal prose, APA/AMA statistical reporting',
  },
  {
    tone: 'business' as const,
    icon: <BusinessIcon />,
    label: 'Business',
    description: 'Clear, direct prose for stakeholder audiences',
  },
  {
    tone: 'technical' as const,
    icon: <TechnicalIcon />,
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
    <div className="space-y-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 sm:p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Step 2
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">
            Analysis Title <span className="text-rose-500">*</span>
          </span>
          <input
            required
            value={context.title}
            onChange={(event) => onChange({ ...context, title: event.target.value })}
            aria-label="Analysis title"
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-subtle)]"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">Sample / Dataset Description</span>
          <input
            value={context.population}
            onChange={(event) => onChange({ ...context, population: event.target.value })}
            aria-label="Sample or dataset description"
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-subtle)]"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">
            Key Question or Outcome <span className="text-rose-500">*</span>
          </span>
          <input
            value={context.primaryOutcome}
            onChange={(event) => onChange({ ...context, primaryOutcome: event.target.value })}
            aria-label="Key question or outcome"
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-subtle)]"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--text-primary)]">Methods Used</span>
          <input
            value={context.statisticalMethods}
            onChange={(event) => onChange({ ...context, statisticalMethods: event.target.value })}
            aria-label="Methods used"
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-subtle)]"
          />
        </label>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Tone</h3>
          <p className="text-sm text-[var(--text-secondary)]">
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
                className={`rounded-2xl border bg-[var(--bg-card)] px-5 py-5 text-left transition ${
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent-subtle)] shadow-sm ring-2 ring-[var(--accent-subtle)]'
                    : 'border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]'
                }`}
              >
                <div className="text-[var(--accent)]">{toneCard.icon}</div>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-[var(--text-primary)]">
                    {toneCard.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {toneCard.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Sections to generate</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Customize the exact sections Scribe should write. At least one section must stay
            selected.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {sectionOptions.map((section) => {
            const isSelected = context.outputSections.includes(section)

            return (
              <button
                key={section}
                type="button"
                onClick={() => toggleSection(section)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]'
                }`}
                title={OUTPUT_SECTION_DESCRIPTIONS[section]}
              >
                <span className="block text-sm font-semibold">{OUTPUT_SECTION_LABELS[section]}</span>
                <span
                  className={`mt-1 block text-xs leading-5 ${
                    isSelected ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {OUTPUT_SECTION_DESCRIPTIONS[section]}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
