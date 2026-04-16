import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

import { MANUSCRIPT_SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts'
import { GenerateRequest, OutputSection } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const SECTION_KEY_ALIASES: Record<OutputSection, string[]> = {
  methods: ['methods', 'method', 'methodology'],
  results: ['results', 'result'],
  approach: ['approach', 'analytical_approach', 'analysis_approach'],
  findings: ['findings', 'finding', 'key_findings'],
  executive_summary: ['executive_summary', 'summary'],
  discussion: ['discussion', 'interpretation'],
  recommendations: ['recommendations', 'recommendation', 'next_steps', 'actions'],
  limitations: ['limitations', 'limitation', 'caveats', 'caveats_and_limitations'],
}

function normalizeKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function resolveSectionContent(parsed: Record<string, unknown>, section: OutputSection) {
  const entries = Object.entries(parsed).map(([key, value]) => [normalizeKey(key), value] as const)

  for (const alias of SECTION_KEY_ALIASES[section]) {
    const match = entries.find(([key]) => key === alias)
    if (typeof match?.[1] === 'string' && match[1].trim()) {
      return match[1].trim()
    }
  }

  return ''
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { files, context } = body

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const nonImageFiles = files.filter((f) => f.type !== 'image')
    const imageFiles = files.filter((f) => f.type === 'image')

    const textPrompt = MANUSCRIPT_SYSTEM_PROMPT + '\n\n' + buildUserPrompt(nonImageFiles, context)

    const contentParts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [{ text: textPrompt }]

    for (const img of imageFiles) {
      contentParts.push({
        inlineData: {
          mimeType: 'image/png',
          data: img.parsedContent,
        },
      })
    }

    const result = await model.generateContent(contentParts)
    const response = await result.response
    let raw = response.text()

    raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const parsed = JSON.parse(raw) as Record<string, unknown>
    const sections = context.outputSections
      .map((sectionKey) => ({
        type: sectionKey,
        content: resolveSectionContent(parsed, sectionKey),
      }))
      .filter((section) => section.content)

    return NextResponse.json({
      sections,
      conversationId: crypto.randomUUID(),
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
