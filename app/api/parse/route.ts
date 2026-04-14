import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const text = await file.text()
  const fileType = file.type

  let parsedContent = ''
  let type: 'csv' | 'image' | 'text' = 'text'

  if (file.name.endsWith('.csv') || fileType === 'text/csv') {
    type = 'csv'
    parsedContent = `CSV TABLE DATA:\n${text}`
  } else if (fileType.startsWith('image/')) {
    type = 'image'
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    parsedContent = base64
  } else {
    type = 'text'
    parsedContent = `R MODEL OUTPUT:\n${text}`
  }

  return NextResponse.json({
    id: crypto.randomUUID(),
    name: file.name,
    type,
    rawContent: type === 'image' ? '' : text,
    parsedContent,
  })
}
