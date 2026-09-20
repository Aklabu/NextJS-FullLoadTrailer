'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PostType, EquipmentType } from './types';
import { EQUIPMENT_LABELS } from './types';

interface FormFields {
  postType: PostType;
  origin: string;
  destination: string;
  cubicFeet: string;
  equipmentType: EquipmentType;
  pickupDate: string;
  description: string;
}

interface FieldErrors {
  [key: string]: string;
}

type SubmitState = 'idle' | 'submitting' | 'error';

const INITIAL: FormFields = {
  postType: 'load_available',
  origin: '', destination: '',
  cubicFeet: '', equipmentType: 'any',
  pickupDate: '', description: '',
};

function validate(f: FormFields): FieldErrors {
  const e: FieldErrors = {};
  if (!f.origin.trim()) e.origin = 'Origin is required.';
  if (!f.destination.trim()) e.destination = 'Destination is required.';
  if (!f.cubicFeet || isNaN(Number(f.cubicFeet)) || Number(f.cubicFeet) <= 0)
    e.cubicFeet = 'Enter a valid cubic footage (positive number).';
  if (!f.pickupDate) e.pickupDate = 'Pickup date is required.';
  if (!f.description.trim()) e.description = 'A brief description is required.';
  else if (f.description.trim().length < 20) e.description = 'Description must be at least 20 characters.';
  return e;
}

function InputField({
  id, label, value, onChange, error, type = 'text', placeholder, required = true,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}{required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#d97b3f]/20"
        style={{ borderColor: error ? '#ef4444' : '#e0d5c8' }}
      />
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
}

export default function CreatePostPage() {
  const router = useRouter();
  const [fields, setFields] = useState<FormFields>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');

  function setField(key: keyof FormFields, value: string) {
    setFields((p) => ({ ...p, [key]: value }));
    setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitState('submitting');
    setSubmitError('');
    try {
      const res = await fetch('/api/board/posts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_type: fields.postType,
          origin: fields.origin.trim(),
          destination: fields.destination.trim(),
          cubic_feet: Number(fields.cubicFeet),
          equipment_type: fields.equipmentType,
          pickup_date: fields.pickupDate,
          description: fields.description.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        router.push(data?.id ? `/board/${data.id}` : '/board');
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitState('error');
        setSubmitError(data?.detail ?? 'Failed to publish. Please try again.');
      }
    } catch {
      setSubmitState('error');
      setSubmitError('Unable to connect. Check your internet and try again.');
    }
  }

  const isSubmitting = submitState === 'submitting';

  return (
    <div className="mx-auto max-w-[560px] px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/board"
          className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Board
        </Link>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#c2622b]">
          <span className="h-1 w-1 rounded-full bg-[#d97b3f]" aria-hidden="true" />
          BULLETIN BOARD
        </span>
        <h1
          className="mt-2 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Create a post
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Share your available load or trailer capacity with the community.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm">

        {/* Submit error */}
        {submitState === 'error' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Post type selector */}
          <div>
            <p className="mb-2 text-sm font-medium text-neutral-700">
              Post type <span className="text-red-500" aria-hidden="true">*</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(['load_available', 'capacity_available'] as PostType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setField('postType', type)}
                  aria-pressed={fields.postType === type}
                  className="flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all"
                  style={{
                    borderColor: fields.postType === type ? '#d97b3f' : '#e8e0d6',
                    background: fields.postType === type ? '#fff8f2' : '#fff',
                  }}
                >
                  <span className="text-xl mb-1.5" aria-hidden="true">
                    {type === 'load_available' ? '📦' : '🚚'}
                  </span>
                  <span className="text-sm font-semibold text-neutral-800">
                    {type === 'load_available' ? 'Load Available' : 'Capacity Available'}
                  </span>
                  <span className="mt-0.5 text-xs text-neutral-400">
                    {type === 'load_available' ? 'I have freight to move' : 'I have trailer space'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Route */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              id="origin" label="Origin city / state"
              value={fields.origin} onChange={(v) => setField('origin', v)}
              error={errors.origin} placeholder="e.g. Chicago, IL"
            />
            <InputField
              id="destination" label="Destination city / state"
              value={fields.destination} onChange={(v) => setField('destination', v)}
              error={errors.destination} placeholder="e.g. Detroit, MI"
            />
          </div>

          {/* Details row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputField
              id="cubicFeet" label="Approx. cubic feet" type="number"
              value={fields.cubicFeet} onChange={(v) => setField('cubicFeet', v)}
              error={errors.cubicFeet} placeholder="e.g. 1200"
            />
            <div>
              <label htmlFor="equipmentType" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Equipment type
              </label>
              <select
                id="equipmentType"
                value={fields.equipmentType}
                onChange={(e) => setField('equipmentType', e.target.value)}
                className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:border-[#d97b3f] appearance-none"
              >
                {(Object.keys(EQUIPMENT_LABELS) as EquipmentType[]).map((k) => (
                  <option key={k} value={k}>{EQUIPMENT_LABELS[k]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pickup date */}
          <InputField
            id="pickupDate" label="Pickup date" type="date"
            value={fields.pickupDate} onChange={(v) => setField('pickupDate', v)}
            error={errors.pickupDate}
          />

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-neutral-700">
              Description <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <textarea
              id="description"
              value={fields.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={4}
              placeholder="Briefly describe the load or capacity. Do not include full addresses or detailed inventory."
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : 'description-hint'}
              className="w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#d97b3f]/20"
              style={{ borderColor: errors.description ? '#ef4444' : '#e0d5c8' }}
            />
            {errors.description
              ? <p id="description-error" className="mt-1.5 text-xs text-red-500" role="alert">{errors.description}</p>
              : <p id="description-hint" className="mt-1.5 text-xs text-neutral-400">Keep it general — no full addresses or detailed inventory lists.</p>
            }
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#c2622b]"
              style={{ background: '#d97b3f' }}
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Publishing…
                </>
              ) : (
                <>
                  Publish post
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
            <Link
              href="/board"
              className="text-sm font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Cancel
            </Link>
          </div>

        </form>
      </div>

      {/* Note */}
      <p className="mt-5 text-center text-xs text-neutral-400">
        Bulletin Board posts are community-only and do not include pricing or bidding.{' '}
        <Link href="/pricing" className="text-[#d97b3f] underline underline-offset-2 hover:text-[#c2622b]">
          Upgrade for marketplace bidding →
        </Link>
      </p>

    </div>
  );
}
