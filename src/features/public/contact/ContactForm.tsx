'use client';

import { useState, useRef } from 'react';
import {
  submitContactForm,
  type Urgency,
  type Category,
  type ContactErrorResponse,
} from '@/features/public/api/contactApi';
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  company: string;
  urgency: Urgency;
  category: Category;
  message: string;
}

interface FieldErrors {
  [key: string]: string;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'account_verification', label: 'Account & SAFER / COI Verification' },
  { value: 'rate_dispute', label: 'Rate Confirmation Dispute' },
  { value: 'billing_escrow', label: 'Billing & Escrow' },
  { value: 'technical_issue', label: 'Technical Issue' },
];

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 25;
const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    company: '',
    urgency: 'normal',
    category: 'account_verification',
    message: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    addFiles(selected);
    // Reset input so same file can be re-added after removal
    e.target.value = '';
  }

  function addFiles(selected: File[]) {
    setFieldErrors((prev) => { const n = { ...prev }; delete n.attachments; return n; });
    const combined = [...files, ...selected];

    // Client-side guards — mirror API validation
    if (combined.length > MAX_FILES) {
      setFieldErrors((prev) => ({ ...prev, attachments: `You may upload at most ${MAX_FILES} files.` }));
      return;
    }
    for (const file of selected) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFieldErrors((prev) => ({ ...prev, attachments: 'Only PDF, PNG, and JPG files are accepted.' }));
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFieldErrors((prev) => ({ ...prev, attachments: `File size must not exceed ${MAX_FILE_SIZE_MB}MB.` }));
        return;
      }
    }
    setFiles(combined);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFieldErrors((prev) => { const n = { ...prev }; delete n.attachments; return n; });
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setFieldErrors({});
    setGeneralError('');

    try {
      const res = await submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        urgency: form.urgency,
        category: form.category,
        message: form.message.trim(),
        attachments: files.length ? files : undefined,
      });
      setSuccessMessage(
        res.message ||
        'Our freight operations team will respond within 2 business hours. Check your email for a ticket confirmation.',
      );
      setStatus('success');
    } catch (err) {
      const apiErr = err as ContactErrorResponse;
      if (apiErr?.status === 'error' && apiErr.errors && Object.keys(apiErr.errors).length) {
        const mapped: FieldErrors = {};
        for (const [key, val] of Object.entries(apiErr.errors)) {
          mapped[key] = Array.isArray(val) ? val[0] : String(val);
        }
        setFieldErrors(mapped);
      } else {
        setGeneralError(apiErr?.message || 'Unable to connect. Check your internet and try again.');
      }
      setStatus('error');
    }
  }

  const isSubmitting = status === 'submitting';
  const charCount = form.message.length;

  // ── Success screen ──────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="rounded-3xl p-12 text-center" style={{ background: '#f7ece0' }}>
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: '#d1fae5' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3
          className="mb-2 text-2xl font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Message Received
        </h3>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-neutral-500">
          {successMessage}
        </p>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-3xl p-8" style={{ background: '#f7ece0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="mb-1 text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color: '#d93506' }}>
        INQUIRY DISPATCH
      </div>
      <h2
        className="mb-6 text-2xl font-normal text-neutral-900"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        Send a Support Request
      </h2>

      {/* General error banner */}
      {status === 'error' && generalError && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Name + Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Full Name <span className="text-[#fc3f07]">*</span>
            </label>
            <input
              id="cf-name" name="name" type="text" required
              value={form.name} onChange={handleChange} disabled={isSubmitting}
              placeholder="Marcus Vance"
              className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
              style={{ borderColor: fieldErrors.name ? '#ef4444' : '#e5e7eb' }}
              aria-invalid={!!fieldErrors.name}
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.name}</p>}
          </div>
          <div>
            <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Work Email <span className="text-[#fc3f07]">*</span>
            </label>
            <input
              id="cf-email" name="email" type="email" required
              value={form.email} onChange={handleChange} disabled={isSubmitting}
              placeholder="you@company.com"
              className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
              style={{ borderColor: fieldErrors.email ? '#ef4444' : '#e5e7eb' }}
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.email}</p>}
          </div>
        </div>

        {/* Company + Urgency */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-company" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Company Name &amp; Role{' '}
              <span className="font-normal text-neutral-400">(Optional)</span>
            </label>
            <input
              id="cf-company" name="company" type="text"
              value={form.company} onChange={handleChange} disabled={isSubmitting}
              placeholder="Apex Logistics Inc (Carrier)"
              className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
            />
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-neutral-700">Urgency Level <span className="text-[#fc3f07]">*</span></p>
            <div className="flex gap-2">
              {(['normal', 'urgent'] as Urgency[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, urgency: u }))}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
                  style={{
                    borderColor: form.urgency === u ? '#fc3f07' : '#e5e7eb',
                    color: form.urgency === u ? '#d93506' : '#6b7280',
                    background: form.urgency === u ? '#fff7ed' : '#fff',
                  }}
                  aria-pressed={form.urgency === u}
                >
                  {u === 'normal' ? 'Normal' : 'Urgent Spot Issue'}
                </button>
              ))}
            </div>
            {fieldErrors.urgency && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.urgency}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="cf-category" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Inquiry Category <span className="text-[#fc3f07]">*</span>
          </label>
          <select
            id="cf-category" name="category" required
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as Category }))}
            disabled={isSubmitting}
            className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
            style={{ borderColor: fieldErrors.category ? '#ef4444' : '#e5e7eb' }}
            aria-invalid={!!fieldErrors.category}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {fieldErrors.category && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.category}</p>}
        </div>

        {/* Message */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="cf-message" className="text-sm font-medium text-neutral-700">
              Message Description <span className="text-[#fc3f07]">*</span>
            </label>
            <span className={`text-xs ${charCount > 1400 ? 'text-amber-500' : 'text-neutral-400'}`}>
              {charCount} / 1,500
            </span>
          </div>
          <textarea
            id="cf-message" name="message" required
            value={form.message} onChange={handleChange} disabled={isSubmitting}
            rows={5} maxLength={1500}
            placeholder="Describe your inquiry in detail…"
            className="w-full resize-y rounded-xl border bg-white px-4 py-2.5 text-sm leading-relaxed text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
            style={{ borderColor: fieldErrors.message ? '#ef4444' : '#e5e7eb' }}
            aria-invalid={!!fieldErrors.message}
          />
          {fieldErrors.message && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.message}</p>}
        </div>

        {/* File upload */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Supporting Documentation{' '}
            <span className="font-normal text-neutral-400">(PDF / PNG / JPG, max 25MB each, up to 5 files)</span>
          </label>

          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Attach files"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="cursor-pointer rounded-xl border-2 border-dashed bg-white/60 px-6 py-8 text-center transition-colors hover:border-[#fc3f07]/50"
            style={{ borderColor: fieldErrors.attachments ? '#ef4444' : '#d1d5db' }}
          >
            <div className="mb-2 text-2xl" aria-hidden="true">📄</div>
            <p className="text-sm font-medium text-neutral-600">Click to attach or drag &amp; drop here</p>
            <p className="mt-1 text-xs text-neutral-400">PDF, PNG, JPG up to 25MB each</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="sr-only"
            aria-hidden="true"
          />
          {fieldErrors.attachments && (
            <p className="mt-1.5 text-xs text-red-500" role="alert">{fieldErrors.attachments}</p>
          )}

          {/* Staged file chips */}
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((file, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0 text-neutral-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate text-sm text-neutral-700">{file.name}</span>
                    <span className="shrink-0 text-xs text-neutral-400">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="shrink-0 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                    aria-label={`Remove ${file.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506]"
          style={{ background: '#fc3f07' }}
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending…
            </>
          ) : 'Send Support Message →'}
        </button>

      </form>
    </div>
  );
}
