export type OutputSection =
  | 'methods'
  | 'results'
  | 'approach'
  | 'findings'
  | 'executive_summary'
  | 'discussion'
  | 'recommendations'
  | 'limitations'

export const OUTPUT_SECTION_LABELS: Record<OutputSection, string> = {
  methods: 'Methods',
  results: 'Results',
  approach: 'Analytical Approach',
  findings: 'Key Findings',
  executive_summary: 'Executive Summary',
  discussion: 'Discussion',
  recommendations: 'Recommendations',
  limitations: 'Caveats & Limitations',
}

export const OUTPUT_SECTION_DESCRIPTIONS: Record<OutputSection, string> = {
  methods: 'How the analysis was conducted',
  results: 'What the data showed',
  approach: 'Overview of the analytical process',
  findings: 'The most important takeaways',
  executive_summary: 'High-level summary for decision makers',
  discussion: 'Interpretation and implications of findings',
  recommendations: 'Suggested actions based on the analysis',
  limitations: 'Caveats, assumptions, and boundaries of the analysis',
}

export const TONE_PRESETS = {
  academic: {
    label: 'Academic',
    description: 'Formal prose, APA/AMA statistical reporting, passive voice',
    defaultSections: ['methods', 'results'] as OutputSection[],
  },
  business: {
    label: 'Business',
    description: 'Clear, direct prose for stakeholder audiences, no jargon',
    defaultSections: ['executive_summary', 'findings', 'recommendations'] as OutputSection[],
  },
  technical: {
    label: 'Technical',
    description: 'Precise, methods-forward for engineering or data science teams',
    defaultSections: ['approach', 'findings', 'limitations'] as OutputSection[],
  },
} as const

export interface UploadedFile {
  id: string
  name: string
  type: 'csv' | 'image' | 'text'
  rawContent: string
  parsedContent: string
}

export interface StudyContext {
  title: string
  population: string
  primaryOutcome: string
  statisticalMethods: string
  outputSections: OutputSection[]
  outputTone: 'academic' | 'business' | 'technical'
}

export interface ManuscriptSection {
  type: OutputSection
  content: string
}

export interface MessageAttachment {
  name: string
  type: UploadedFile['type']
}

export interface IterationMessage {
  role: 'user' | 'assistant'
  content: string
  attachments?: MessageAttachment[]
  updatedSections?: ManuscriptSection[]
}

export interface GenerateRequest {
  files: UploadedFile[]
  context: StudyContext
}

export interface GenerateResponse {
  sections: ManuscriptSection[]
  conversationId: string
}
