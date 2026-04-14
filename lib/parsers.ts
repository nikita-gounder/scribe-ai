import { v4 as uuidv4 } from 'uuid'

import { UploadedFile } from '@/types'

export async function parseCSV(file: File): Promise<UploadedFile> {
  const text = await file.text()
  return {
    id: uuidv4(),
    name: file.name,
    type: 'csv',
    rawContent: text,
    parsedContent: `CSV TABLE DATA:\n${text}`,
  }
}

export async function parseImage(file: File): Promise<UploadedFile> {
  const buffer = await file.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  return {
    id: uuidv4(),
    name: file.name,
    type: 'image',
    rawContent: base64,
    parsedContent: `IMAGE: ${file.name} (base64 encoded, will be passed to vision model)`,
  }
}

export async function parseText(file: File): Promise<UploadedFile> {
  const text = await file.text()
  return {
    id: uuidv4(),
    name: file.name,
    type: 'text',
    rawContent: text,
    parsedContent: `R OUTPUT TEXT:\n${text}`,
  }
}
