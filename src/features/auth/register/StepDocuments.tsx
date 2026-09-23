'use client';

import { useRef } from 'react';
import type { UploadedFile, Tier } from './useRegistrationForm';

const ACCEPTED = '.pdf,.jpg,.jpeg,.png';
const MAX_MB = 10;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileRow({ f, onRemove }: { f: UploadedFile; onRemove: (id: string) => void }) {
  const isError = f.status === 'error';
  const isDone = f.status === 'done';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#e8e0d6] bg-white p-3.5">
      {/* File icon */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm"
        style={{ background: isError ? '#fef2f2' : '#f3ede4', color: isError ? '#ef4444' : '#fc3f07' }}
        aria-hidden="true"
      >
        {isError ? '✕' : '📄'}
      </div>

      {/* Info + progress */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-800">{f.file.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-neutral-400">{formatBytes(f.file.size)}</span>
          {isError && <span className="text-xs text-red-500">{f.errorMsg ?? 'Upload failed'}</span>}
          {isDone && <span className="text-xs text-green-600">Uploaded</span>}
          {(f.status === 'uploading' || f.status === 'pending') && (
            <span className="text-xs text-neutral-400">{f.progress}%</span>
          )}
        </div>
        {(f.status === 'uploading' || f.status === 'pending') && (
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#f3ede4]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${f.progress}%`, background: '#fc3f07' }}
              role="progressbar"
              aria-valuenow={f.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(f.id)}
        aria-label={`Remove ${f.file.name}`}
        className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

interface Props {
  tier: Tier;
  files: UploadedFile[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}

export default function StepDocuments({ tier, files, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(incoming: FileList | null) {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => {
      if (f.size > MAX_MB * 1024 * 1024) return false;
      return true;
    });
    if (valid.length) onAdd(valid);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  const advancedDocs = [
    'Certificate of Insurance (COI) — $1M auto liability minimum',
    'Operating Authority letter or MC certificate',
    ...(tier === 'advanced' ? ['FMCSA Safety Rating document (if available)'] : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2
          className="mb-1 text-xl font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Verification documents
        </h2>
        <p className="text-sm text-neutral-500">
          {tier === 'basic'
            ? 'Documents are optional for Basic tier but help speed up approval.'
            : 'Required for Advanced verification. Our team reviews these before granting marketplace access.'}
        </p>
      </div>

      {/* What to upload */}
      {tier === 'advanced' && (
        <div className="rounded-xl border border-[#f0c896] bg-[#fffbf5] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[1px] text-[#d93506]">Required documents</p>
          <ul className="space-y-1.5">
            {advancedDocs.map((d) => (
              <li key={d} className="flex items-start gap-2 text-xs text-[#7a4a1a]">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        aria-label="Upload documents — click or drag and drop"
        className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#e0d5c8] bg-white px-6 py-10 text-center transition-colors hover:border-[#fc3f07] hover:bg-[#fffbf5] focus-visible:outline-2 focus-visible:outline-[#fc3f07]"
      >
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
          style={{ background: '#f3ede4' }}
          aria-hidden="true"
        >
          📎
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-700">
            Click to upload or drag &amp; drop
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">
            PDF, JPG, PNG — max {MAX_MB} MB each
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2.5">
          {files.map((f) => (
            <FileRow key={f.id} f={f} onRemove={onRemove} />
          ))}
        </div>
      )}

      {/* Skip note for basic */}
      {tier === 'basic' && (
        <p className="text-center text-xs text-neutral-400">
          You can add documents later from your account settings.
        </p>
      )}
    </div>
  );
}
