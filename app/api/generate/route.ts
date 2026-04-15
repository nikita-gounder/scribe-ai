import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

import { MANUSCRIPT_SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts'
import { GenerateRequest } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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

    const parsed = JSON.parse(raw)
    const sections = context.outputSections
      .map((sectionKey) => ({
        type: sectionKey,
        content: parsed[sectionKey] || '',
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
