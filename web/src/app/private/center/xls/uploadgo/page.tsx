'use client'

// Save as: src/app/private/center/xls/upload/page.tsx (Next.js App Router)
// Minimal upload UI that POSTs multipart/form-data to a Go microservice.
// Configure endpoint and field name via envs:
//   NEXT_PUBLIC_GO_UPLOAD_ENDPOINT  (default: '/upload')
//   NEXT_PUBLIC_UPLOAD_FIELD        (default: 'file')
// If your Go service needs cookies, it can set them; we send withCredentials=true.

import { useCallback, useRef, useState, ChangeEvent, DragEvent, FormEvent } from 'react'

export default function UploadPage() {
  const ENDPOINT = process.env.NEXT_PUBLIC_GO_UPLOAD_ENDPOINT ?? '/upload'
  const FIELD = process.env.NEXT_PUBLIC_UPLOAD_FIELD ?? 'file'

  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const accept = '.csv,.xls,.xlsx'
  const maxBytes = 10 * 1024 * 1024 // 10MB

  const onSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > maxBytes) {
      setError('File too large (max 10MB)')
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }, [])

  const onDrop = useCallback((e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    if (f.size > maxBytes) {
      setError('File too large (max 10MB)')
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }, [])

  const reset = () => {
    setFile(null)
    setProgress(0)
    setMessage('')
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    if (!file) {
      setError('Choose a file first')
      return
    }

    const fd = new FormData()
    fd.append(FIELD, file)

    try {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', ENDPOINT, true)
      xhr.withCredentials = true // include cookies if set by Go service

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          setProgress(Math.round((evt.loaded / evt.total) * 100))
        }
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            setMessage('Upload complete')
            try {
              const json = JSON.parse(xhr.responseText)
              if (json?.message) setMessage(json.message)
            } catch {}
          } else {
            setError(`Upload failed (${xhr.status})`)
          }
        }
      }

      xhr.send(fd)
    } catch (err: any) {
      setError(String(err))
    }
  }

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-bold mb-2">Shared Files</h1>
      <p className="mb-6">
        Route: <code className="px-1 py-0.5 rounded bg-gray-100">/private/center/xls/upload</code>
      </p>

      <form onSubmit={submit} className="space-y-4" aria-label="Upload file to Go service">
        <label
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          className={`relative flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed text-center transition ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
        >
          <input ref={inputRef} id="file" type="file" accept={accept} onChange={onSelect} className="hidden" />
          <div className="pointer-events-none">
            <div className="text-base font-medium">Drop a CSV/XLS/XLSX here</div>
            <div className="text-sm text-gray-500">or click to choose (max 10MB)</div>
          </div>
        </label>

        {file && (
          <div className="text-sm text-gray-700">Selected: <span className="font-medium">{file.name}</span> ({Math.round(file.size/1024)} KB)</div>
        )}

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={!file} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
            Upload
          </button>
          {file && (
            <button type="button" onClick={reset} className="px-3 py-2 rounded border">
              Reset
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500">
          Posting to <code>{ENDPOINT}</code> as <code>multipart/form-data</code> with field <code>{FIELD}</code>.
        </p>
      </form>
    </main>
  )
}
