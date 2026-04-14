'use client'

import { useMemo, useRef, useState } from 'react'

import { parseCSV, parseImage, parseText } from '@/lib/parsers'
import { cn } from '@/lib/utils'
import { UploadedFile } from '@/types'

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

type PendingFile = {
  id: string
  name: string
  size: number
  typeLabel: 'CSV' | 'Image' | 'Text'
}

const ACCEPTED_EXTENSIONS = ['.csv', '.png', '.jpg', '.jpeg', '.txt']
const ACCEPTED_INPUT = ACCEPTED_EXTENSIONS.join(',')
const MAX_FILES = 10

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function getFileType(file: File): UploadedFile['type'] | null {
  const name = file.name.toLowerCase()

  if (name.endsWith('.csv') || file.type === 'text/csv') return 'csv'
  if (
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    file.type.startsWith('image/')
  ) {
    return 'image'
  }
  if (name.endsWith('.txt') || file.type.startsWith('text/')) return 'text'

  return null
}

function getTypeLabel(type: UploadedFile['type']) {
  if (type === 'csv') return 'CSV'
  if (type === 'image') return 'Image'
  return 'Text'
}

function getTypeBadge(type: UploadedFile['type']) {
  if (type === 'csv') return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
  if (type === 'image') return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
  return 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
}

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [fileSizes, setFileSizes] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)

  const currentFileCount = files.length + pendingFiles.length

  const displayFiles = useMemo(
    () =>
      files.map((file) => ({
        ...file,
        size: fileSizes[file.id] ?? 0,
      })),
    [fileSizes, files]
  )

  async function parseFiles(fileList: FileList | null) {
    if (!fileList) return

    const selectedFiles = Array.from(fileList)
    const remainingSlots = MAX_FILES - currentFileCount
    let nextFiles = [...files]

    if (remainingSlots <= 0) {
      setError('You can upload up to 10 files total.')
      return
    }

    const validFiles = selectedFiles.filter((file) => getFileType(file))

    if (validFiles.length !== selectedFiles.length) {
      setError('Only CSV, PNG, JPG, JPEG, and TXT files are supported.')
    } else {
      setError(null)
    }

    const filesToProcess = validFiles.slice(0, remainingSlots)

    if (validFiles.length > remainingSlots) {
      setError(`Only ${remainingSlots} more file${remainingSlots === 1 ? '' : 's'} can be added.`)
    }

    for (const file of filesToProcess) {
      const fileType = getFileType(file)

      if (!fileType) continue

      const pendingId = `${file.name}-${file.size}-${file.lastModified}`
      setPendingFiles((current) => [
        ...current,
        {
          id: pendingId,
          name: file.name,
          size: file.size,
          typeLabel: getTypeLabel(fileType),
        },
      ])

      try {
        let parsedFile: UploadedFile

        if (fileType === 'csv') {
          parsedFile = await parseCSV(file)
        } else if (fileType === 'image') {
          parsedFile = await parseImage(file)
        } else {
          parsedFile = await parseText(file)
        }

        setFileSizes((current) => ({ ...current, [parsedFile.id]: file.size }))
        nextFiles = [...nextFiles, parsedFile]
        onFilesChange(nextFiles)
      } catch {
        setError(`Failed to parse ${file.name}.`)
      } finally {
        setPendingFiles((current) => current.filter((entry) => entry.id !== pendingId))
      }
    }
  }

  function removeFile(fileId: string) {
    onFilesChange(files.filter((file) => file.id !== fileId))
    setFileSizes((current) => {
      const next = { ...current }
      delete next[fileId]
      return next
    })
  }

  return (
    <div className="space-y-5">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_INPUT}
        className="hidden"
        onChange={(event) => {
          void parseFiles(event.target.files)
          event.target.value = ''
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={() => setIsDragging(true)}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
          setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          void parseFiles(event.dataTransfer.files)
        }}
        className={cn(
          'w-full rounded-2xl border-2 border-dashed bg-slate-50 p-8 text-center transition',
          isDragging
            ? 'border-slate-900 bg-slate-100 shadow-inner'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-100'
        )}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Step 1</p>
        <p className="mt-3 text-xl font-semibold text-slate-950">Drop analysis files here</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Drag CSV, image, or text outputs into the workspace, or click to browse.
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">
          Accepted: {ACCEPTED_EXTENSIONS.join(' · ')} | Max {MAX_FILES} files
        </p>
      </button>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {displayFiles.map((file) => (
          <div
            key={file.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-950">{file.name}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span
                  className={cn(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em]',
                    getTypeBadge(file.type)
                  )}
                >
                  {getTypeLabel(file.type)}
                </span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(file.id)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
              aria-label={`Remove ${file.name}`}
            >
              X
            </button>
          </div>
        ))}

        {pendingFiles.map((file) => (
          <div
            key={file.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 ring-1 ring-slate-200">
                  {file.typeLabel}
                </span>
                <span>{formatFileSize(file.size)}</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-slate-600">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
              Parsing...
            </div>
          </div>
        ))}

        {displayFiles.length === 0 && pendingFiles.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
            No files uploaded yet.
          </div>
        )}
      </div>
    </div>
  )
}
