import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

import { MANUSCRIPT_SYSTEM_PROMPT } from '@/lib/prompts'
import { IterationMessage, ManuscriptSection, StudyContext, UploadedFile } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(req: NextRequest) {
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

    const systemContext = `
${MANUSCRIPT_SYSTEM_PROMPT}

You are now in refinement mode. The user has already generated the following analytical narrative sections:

CURRENT METHODS SECTION:
${originalSections.find((s) => s.type === 'methods')?.content || ''}

CURRENT RESULTS SECTION:
${originalSections.find((s) => s.type === 'results')?.content || ''}

ANALYSIS CONTEXT:
Title: ${context.title}
Sample / Dataset Description: ${context.population}
Key Question or Outcome: ${context.primaryOutcome}
Methods Used: ${context.statisticalMethods}
Target Output Style: ${context.journalStyle}

The user wants to refine these sections. You can:
- Update specific sections based on their feedback
- Incorporate new data or files they provide
- Rewrite for different audiences or styles
- Add missing statistics or clarifications

Always respond with a JSON object in this exact format:
{
  "message": "Brief explanation of what you changed",
  "updatedSections": [
    { "type": "methods", "content": "updated or unchanged methods text" },
    { "type": "results", "content": "updated or unchanged results text" }
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

    const result = await model.generateContent(contentParts)
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
    return NextResponse.json({ error: 'Iteration failed' }, { status: 500 })
  }
}
