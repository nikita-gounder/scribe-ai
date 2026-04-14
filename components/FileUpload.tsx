'use client'

import { UploadedFile } from '@/types'

interface FileUploadProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
  void onFilesChange

  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Step 1</p>
      <p className="mt-3 text-lg font-medium text-slate-900">File Upload Component</p>
      <p className="mt-2 text-sm text-slate-500">
        Drag-and-drop upload will be implemented next. Current placeholder count: {files.length}
      </p>
    </div>
  )
}
