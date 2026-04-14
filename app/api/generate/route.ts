import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

import { buildUserPrompt, MANUSCRIPT_SYSTEM_PROMPT } from '@/lib/prompts'
import { GenerateRequest } from '@/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()
    const { files, context } = body

    const imageFiles = files.filter((f) => f.type === 'image')
    const nonImageFiles = files.filter((f) => f.type !== 'image')
    const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = []

    userContent.push({
      type: 'text',
      text: buildUserPrompt(nonImageFiles, context),
    })

    for (const img of imageFiles) {
      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/png;base64,${img.parsedContent}`,
          detail: 'high',
        },
      })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: MANUSCRIPT_SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    })

    const raw = response.choices[0].message.content || '{}'
    const parsed = JSON.parse(raw)

    return NextResponse.json({
      sections: [
        { type: 'methods', content: parsed.methods || '' },
        { type: 'results', content: parsed.results || '' },
      ],
      conversationId: crypto.randomUUID(),
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
