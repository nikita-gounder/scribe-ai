import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

import { checkRateLimit, isGeminiTimeout, withGeminiTimeout } from '@/lib/api-guard'
import { MANUSCRIPT_SYSTEM_PROMPT } from '@/lib/prompts'
import {
  IterationMessage,
  ManuscriptSection,
  OUTPUT_SECTION_LABELS,
  StudyContext,
  UploadedFile,
} from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
  const rateLimitResponse = checkRateLimit(req)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const {
      messages,
      newMessage,
      additionalFiles,
      originalSections,
      context,
    }: {
      messages: IterationMessage[]
      newMessage: string
      additionalFiles: UploadedFile[]
      originalSections: ManuscriptSection[]
      context: StudyContext
    } = await req.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const currentSectionText = originalSections
      .map(
        (section) =>
          `${OUTPUT_SECTION_LABELS[section.type].toUpperCase()}:\n${section.content}`
      )
      .join('\n\n')

    const requestedSectionLabels = context.outputSections
      .map((section) => OUTPUT_SECTION_LABELS[section])
      .join(', ')

    const systemContext = `
${MANUSCRIPT_SYSTEM_PROMPT}

You are now in refinement mode. The user has already generated the following analytical narrative sections:

CURRENT SECTIONS:
${currentSectionText}

ANALYSIS CONTEXT:
Title: ${context.title}
Sample / Dataset Description: ${context.population}
Key Question or Outcome: ${context.primaryOutcome}
Methods Used: ${context.statisticalMethods}
Target Tone: ${context.outputTone}
Requested Sections: ${requestedSectionLabels}

The user wants to refine these sections. You can:
- Update specific sections based on their feedback
- Incorporate new data or files they provide
- Rewrite for different audiences or styles
- Add missing statistics or clarifications

Always respond with a JSON object in this exact format:
{
  "message": "Brief explanation of what you changed",
  "updatedSections": [
    { "type": "section_name", "content": "updated or unchanged section text" }
  ]
}
`

    const conversationHistory = messages
      .map((message) => {
        const attachmentSummary =
          message.attachments && message.attachments.length > 0
            ? `\nAttachments: ${message.attachments.map((file) => file.name).join(', ')}`
            : ''

        return `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content}${attachmentSummary}`
      })
      .join('\n')

    const contentParts: Array<
      | { text: string }
      | { inlineData: { mimeType: string; data: string } }
    > = [
      {
        text:
          systemContext +
          '\n\nCONVERSATION HISTORY:\n' +
          conversationHistory +
          '\n\nUser: ' +
          newMessage,
      },
    ]

    if (additionalFiles && additionalFiles.length > 0) {
      for (const file of additionalFiles) {
        if (file.type === 'image') {
          contentParts.push({
            inlineData: {
              mimeType: 'image/png',
              data: file.parsedContent,
            },
          })
        } else {
          contentParts.push({
            text: `\nADDITIONAL FILE PROVIDED: ${file.name}\n${file.parsedContent}`,
          })
        }
      }
    }

    const result = await withGeminiTimeout(model.generateContent(contentParts))
    const response = await result.response
    let raw = response.text()
    raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    const parsed = JSON.parse(raw)

    return NextResponse.json({
      message: parsed.message || 'Sections updated.',
      updatedSections: parsed.updatedSections || [],
    })
  } catch (error) {
    console.error('Iterate error:', error)

    if (isGeminiTimeout(error)) {
      return NextResponse.json({ error: 'Generation timed out. Please try again.' }, { status: 504 })
    }

    return NextResponse.json({ error: 'Iteration failed' }, { status: 500 })
  }
}
