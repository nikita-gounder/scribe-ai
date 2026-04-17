'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

import { parseCSV, parseImage, parseText } from '@/lib/parsers'
import { cn } from '@/lib/utils'
import {
  IterationMessage,
  ManuscriptSection,
  MessageAttachment,
  StudyContext,
  UploadedFile,
} from '@/types'

interface IterationPanelProps {
  context: StudyContext
  messages: IterationMessage[]
  originalSections: ManuscriptSection[]
  onMessagesChange: (messages: IterationMessage[]) => void
  onSectionsUpdate: (sections: ManuscriptSection[]) => void
  isLoading: boolean
  onLoadingChange: (isLoading: boolean) => void
}

const ACCEPTED_INPUT = '.csv,.png,.jpg,.jpeg,.txt'
const MAX_FILE_SIZE = 10 * 1024 * 1024

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 11.5 12.9 19.6a5 5 0 1 1-7.1-7.1L14 4.3a3.5 3.5 0 1 1 5 5L10.7 17.6a2 2 0 1 1-2.8-2.8l7.1-7.1" />
    </svg>
  )
}

function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-muted)] shadow-sm">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:-0.2s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:-0.1s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)]" />
    </div>
  )
}

async function parseAdditionalFile(file: File): Promise<UploadedFile> {
  const lowerName = file.name.toLowerCase()

  if (lowerName.endsWith('.csv') || file.type === 'text/csv') {
    return parseCSV(file)
  }
  if (
    lowerName.endsWith('.png') ||
    lowerName.endsWith('.jpg') ||
    lowerName.endsWith('.jpeg') ||
    file.type.startsWith('image/')
  ) {
    return parseImage(file)
  }
  if (lowerName.endsWith('.txt') || file.type.startsWith('text/')) {
    return parseText(file)
  }

  throw new Error('Unsupported file type')
}

export default function IterationPanel({
  context,
  messages,
  originalSections,
  onMessagesChange,
  onSectionsUpdate,
  isLoading,
  onLoadingChange,
}: IterationPanelProps) {
  const [draft, setDraft] = useState('')
  const [additionalFiles, setAdditionalFiles] = useState<UploadedFile[]>([])
  const [additionalFileNames, setAdditionalFileNames] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const hasMessages = messages.length > 0
  const placeholderExamples = useMemo(
    () =>
      "Ask me to refine your draft. Examples: 'Make the methods more concise', 'Rewrite this for an executive audience', 'Add context from the uploaded dashboard', 'Make the findings more technical'",
    []
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [isLoading, messages])

  async function handleFileSelect(fileList: FileList | null) {
    if (!fileList) return

    const selectedFiles = Array.from(fileList)
    const parsedFiles: UploadedFile[] = []
    const parsedNames: string[] = []

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`${file.name} exceeds the 10MB file size limit.`)
        continue
      }

      try {
        const parsed = await parseAdditionalFile(file)
        parsedFiles.push(parsed)
        parsedNames.push(file.name)
      } catch {
        setError(`Unsupported file type for ${file.name}.`)
      }
    }

    if (parsedFiles.length > 0) {
      setError(null)
      setAdditionalFiles((current) => [...current, ...parsedFiles])
      setAdditionalFileNames((current) => [...current, ...parsedNames])
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const newMessage = draft.trim()
    if (!newMessage || isLoading) return

    setError(null)
    setDraft('')
    onLoadingChange(true)

    const attachments: MessageAttachment[] = additionalFiles.map((file) => ({
      name: file.name,
      type: file.type,
    }))

    try {
      const response = await fetch('/api/iterate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          newMessage,
          additionalFiles,
          originalSections,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Iteration failed')
      }

      const data: {
        message: string
        updatedSections: ManuscriptSection[]
      } = await response.json()

      const nextMessages: IterationMessage[] = [
        ...messages,
        { role: 'user', content: newMessage, attachments },
        {
          role: 'assistant',
          content: data.message || 'Sections updated.',
        },
      ]

      onMessagesChange(nextMessages)

      if (data.updatedSections?.length > 0) {
        onSectionsUpdate(data.updatedSections)
      }

      setAdditionalFiles([])
      setAdditionalFileNames([])
    } catch {
      setError('Iteration failed — please try again')
      onMessagesChange([
        ...messages,
        { role: 'user', content: newMessage, attachments },
        { role: 'assistant', content: 'Iteration failed — please try again' },
      ])
    } finally {
      onLoadingChange(false)
    }
  }

  return (
    <div className="flex h-[400px] flex-col rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 shadow-sm sm:p-5 lg:h-[500px]">
      <div className="border-b border-[var(--border-subtle)] px-2 pb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Iteration Panel
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Refine the Draft</h2>
      </div>

      <div ref={scrollRef} className="mt-4 flex-1 space-y-4 overflow-y-auto px-1 pb-4">
        {hasMessages ? (
          messages.map((message, index) => {
            const isUser = message.role === 'user'

            return (
              <div
                key={`${message.role}-${index}`}
                className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[90%] rounded-3xl px-4 py-3 shadow-sm',
                    isUser
                      ? 'bg-[var(--accent)] text-white'
                      : 'border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-primary)]'
                  )}
                >
                  <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.attachments.map((attachment) => (
                        <span
                          key={`${attachment.name}-${attachment.type}`}
                          className={cn(
                            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
                            isUser
                              ? 'bg-white/15 text-white'
                              : 'border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                          )}
                        >
                          <PaperclipIcon />
                          {attachment.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="rounded-3xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-6 text-sm leading-7 text-[var(--text-secondary)]">
            {placeholderExamples}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <TypingDots />
          </div>
        )}
      </div>

      <div className="border-t border-[var(--border-subtle)] pt-4">
        {additionalFileNames.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {additionalFileNames.map((name) => (
              <span
                key={name}
                className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
              >
                {name}
              </span>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_INPUT}
            className="hidden"
            onChange={(event) => {
              void handleFileSelect(event.target.files)
              event.target.value = ''
            }}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]"
            aria-label="Upload additional context"
          >
            <PaperclipIcon />
          </button>

          <div className="flex-1">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Describe how you want the draft refined"
              className="min-h-24 w-full rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-subtle)]"
            />
          </div>

          <button
            type="submit"
            disabled={!draft.trim() || isLoading}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--text-muted)]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
