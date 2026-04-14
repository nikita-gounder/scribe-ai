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
  journalStyle: 'APA' | 'AMA' | 'Nature'
}

export interface ManuscriptSection {
  type: 'methods' | 'results'
  content: string
}

export interface IterationMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface GenerateRequest {
  files: UploadedFile[]
  context: StudyContext
}

export interface GenerateResponse {
  sections: ManuscriptSection[]
  conversationId: string
}
