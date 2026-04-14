import { v4 as uuidv4 } from 'uuid'

import { UploadedFile } from '@/types'

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

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
  const base64 = arrayBufferToBase64(buffer)

  return {
    id: uuidv4(),
    name: file.name,
    type: 'image',
    rawContent: '',
    parsedContent: base64,
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
