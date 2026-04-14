import IterationPanel from '@/components/IterationPanel'
import ManuscriptOutput from '@/components/ManuscriptOutput'
import { IterationMessage, ManuscriptSection } from '@/types'

const sections: ManuscriptSection[] = [
  {
    type: 'methods',
    content:
      'Methods output will appear here once generation is connected to the OpenAI API.',
  },
  {
    type: 'results',
    content:
      'Results output will appear here once generation is connected to the OpenAI API.',
  },
]

const messages: IterationMessage[] = [
  { role: 'assistant', content: 'Iteration history will appear here after the first draft.' },
]

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
            Results Workspace
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            Draft, review, and refine manuscript sections.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            This placeholder view reserves space for generated Methods and Results on the left and
            iterative refinement on the right.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <ManuscriptOutput sections={sections} isLoading={false} />
          <IterationPanel messages={messages} onSendMessage={() => {}} isLoading={false} />
        </div>
      </div>
    </main>
  )
}
