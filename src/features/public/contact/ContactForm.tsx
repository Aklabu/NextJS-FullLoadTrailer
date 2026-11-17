'use client';

import { useState } from 'react';
import { submitContactForm, type ContactErrorResponse } from '@/features/public/api/contactApi';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
  fleetSize: string;
  message: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const FLEET_SIZES = [
  'Fleet Size (Number of Trucks)',
  '1–2 Trucks',
  '3–5 Trucks',
  '6–10 Trucks',
  '11–25 Trucks',
  '26–50 Trucks',
  '50+ Trucks',
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    fleetSize: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof FormState]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[name as keyof FormState]; return n; });
    }
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.email.trim()) next.email = 'Email address is required.';
    if (!form.message.trim()) next.message = 'Please describe how we can help.';
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  // Maps API error keys (snake_case) back to form state keys (camelCase)
  function mapApiErrors(errors: Record<string, string[]>): FieldErrors {
    const map: Record<string, keyof FormState> = {
      full_name: 'fullName',
      company_name: 'companyName',
      phone: 'phone',
      email: 'email',
      fleet_size: 'fleetSize',
      message: 'message',
    };
    const result: FieldErrors = {};
    for (const [key, messages] of Object.entries(errors)) {
      const formKey = map[key];
      if (formKey) result[formKey] = messages[0];
    }
    return result;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setFieldErrors({});
    setGeneralError('');

    try {
      await submitContactForm({
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        ...(form.companyName.trim() && { company_name: form.companyName.trim() }),
        ...(form.fleetSize && { fleet_size: form.fleetSize }),
      });
      setStatus('success');
    } catch (err) {
      const apiErr = err as ContactErrorResponse;
      if (apiErr.statusCode === 400 && apiErr.errors && Object.keys(apiErr.errors).length) {
        setFieldErrors(mapApiErrors(apiErr.errors));
        setStatus('error');
      } else {
        setGeneralError(apiErr?.message || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    }
  }

  const isSubmitting = status === 'submitting';

  // ── Success screen ──────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="rounded-2xl border p-10 text-center" style={{ background: '#fff', borderColor: '#e5e7eb' }}>
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: '#d1fae5' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-neutral-900">Message Sent!</h3>
        <p className="text-sm text-neutral-500">
          Our team will respond within 2 business hours. Check your email for a confirmation.
        </p>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border p-6 sm:p-8" style={{ background: '#fff', borderColor: '#e5e7eb' }}>
      <h2 className="text-xl font-bold mb-5" style={{ color: '#1a1a1a' }}>Send Us a Message</h2>

      {/* General error banner */}
      {status === 'error' && generalError && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Row 1: Full Name + Company Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              id="cf-fullName"
              name="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Full Name *"
              className="w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#fc3f07]/20"
              style={{ borderColor: fieldErrors.fullName ? '#ef4444' : '#d1d5db' }}
            />
            {fieldErrors.fullName && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.fullName}</p>}
          </div>
          <div>
            <input
              id="cf-companyName"
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Company Name"
              className="w-full rounded-lg border border-[#d1d5db] px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#fc3f07]/20"
            />
          </div>
        </div>

        {/* Row 2: Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              id="cf-phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Phone Number *"
              className="w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#fc3f07]/20"
              style={{ borderColor: fieldErrors.phone ? '#ef4444' : '#d1d5db' }}
            />
            {fieldErrors.phone && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.phone}</p>}
          </div>
          <div>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Email Address *"
              className="w-full rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#fc3f07]/20"
              style={{ borderColor: fieldErrors.email ? '#ef4444' : '#d1d5db' }}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.email}</p>}
          </div>
        </div>

        {/* Row 3: Fleet size dropdown */}
        <div>
          <select
            id="cf-fleetSize"
            name="fleetSize"
            value={form.fleetSize}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full rounded-lg border border-[#d1d5db] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#fc3f07]/20"
            style={{ color: form.fleetSize ? '#1a1a1a' : '#9ca3af' }}
          >
            {FLEET_SIZES.map((s, i) => (
              <option key={s} value={i === 0 ? '' : s} disabled={i === 0}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Row 4: Message */}
        <div>
          <textarea
            id="cf-message"
            name="message"
            required
            value={form.message}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={5}
            placeholder="How can we help you? *"
            className="w-full resize-y rounded-lg border px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-[#fc3f07]/20"
            style={{ borderColor: fieldErrors.message ? '#ef4444' : '#d1d5db' }}
          />
          {fieldErrors.message && <p className="mt-1 text-xs text-red-500" role="alert">{fieldErrors.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ background: '#fc3f07' }}
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Send Message
            </>
          )}
        </button>

      </form>
    </div>
  );
}
