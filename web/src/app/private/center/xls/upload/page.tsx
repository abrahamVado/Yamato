'use client';

import { useCallback, useRef, useState, DragEvent, ChangeEvent, FormEvent } from 'react';

type Backend = 'laravel' | 'go';

const ACTIVE: Backend = (process.env.NEXT_PUBLIC_UPLOAD_BACKEND as Backend) || 'go';
const ENDPOINT =
  ACTIVE === 'laravel'
    ? process.env.NEXT_PUBLIC_LARAVEL_UPLOAD_URL ?? '/upload.php'
    : process.env.NEXT_PUBLIC_GO_UPLOAD_URL ?? '/upload';
const FIELD =
  ACTIVE === 'laravel'
    ? process.env.NEXT_PUBLIC_LARAVEL_FIELD ?? 'data'
    : process.env.NEXT_PUBLIC_GO_FIELD ?? 'file';

// (Optional) read non-HttpOnly CSRF cookie for Laravel (e.g., XSRF-TOKEN)
function getCookie(name: string) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = '.xls,.xlsx';
  const maxBytes = 10 * 1024 * 1024; // 10MB

  const onSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > maxBytes) {
      setError('File too large (max 10MB)');
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (f.size > maxBytes) {
      setError('File too large (max 10MB)');
      setFile(null);
      return;
    }
    setError('');
    setFile(f);
  }, []);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);

  const reset = () => {
    setFile(null);
    setProgress(0);
    setMessage('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!file) {
      setError('Choose a file first');
      return;
    }

    const form = new FormData();
    form.append(FIELD, file);

    // If Laravel needs extras (e.g. import_id), add them:
    // if (ACTIVE === 'laravel') form.append('import_id', '...');

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', ENDPOINT, true);
      xhr.withCredentials = true; // include cookies if backend uses them

      // Optional CSRF for Laravel (double-submit cookie)
      if (ACTIVE === 'laravel') {
        const xsrf = getCookie('XSRF-TOKEN'); // must be non-HttpOnly
        if (xsrf) xhr.setRequestHeader('X-XSRF-TOKEN', xsrf);
      }

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            setMessage('Upload complete');
            try {
              const json = JSON.parse(xhr.responseText);
              if (json?.message) setMessage(json.message);
            } catch {}
          } else {
            setError(`Upload failed (${xhr.status})`);
          }
        }
      };

      xhr.send(form);
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <main className="container mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-bold mb-2">Shared Files</h1>
      <p className="mb-6">
        Active backend: <code>{process.env.NEXT_PUBLIC_UPLOAD_BACKEND}</code> →{' '}
        <code>{ENDPOINT}</code> (field <code>{FIELD}</code>)
      </p>

      <form onSubmit={submit} className="space-y-4" aria-label="Upload Excel file">
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center transition
            ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <input ref={inputRef} id="file" type="file" accept={accept} onChange={onSelect} className="hidden" />
          <label htmlFor="file" className="cursor-pointer">
            <div className="text-base font-medium">Drop an Excel file here</div>
            <div className="text-sm text-gray-500">or click to choose .xls / .xlsx (max 10MB)</div>
          </label>
          {file && (
            <div className="mt-3 text-sm">
              Selected: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)
            </div>
          )}
        </div>

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
          The file is sent to <code>{ENDPOINT}</code> as <code>multipart/form-data</code> with field name <code>{FIELD}</code>.
        </p>
      </form>
    </main>
  );
}
