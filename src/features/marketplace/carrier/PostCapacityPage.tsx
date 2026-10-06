'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { EQUIPMENT_OPTIONS } from '@/lib/equipmentOptions';

interface CapacityForm {
  origin: string;
  destination: string;
  availableFrom: string;
  availableTo: string;
  cubicFeet: string;
  equipmentType: string;
  notes: string;
}

interface FieldErrors { [k: string]: string }
type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL: CapacityForm = { origin: '', destination: '', availableFrom: '', availableTo: '', cubicFeet: '', equipmentType: 'Box Truck', notes: '' };

function validate(f: CapacityForm): FieldErrors {
  const e: FieldErrors = {};
  if (!f.origin.trim()) e.origin = 'Origin is required.';
  if (!f.destination.trim()) e.destination = 'Destination is required.';
  if (!f.availableFrom) e.availableFrom = 'Available from date is required.';
  if (!f.availableTo) e.availableTo = 'Available to date is required.';
  else if (f.availableTo < f.availableFrom) e.availableTo = 'Must be after available from date.';
  if (!f.cubicFeet || isNaN(Number(f.cubicFeet)) || Number(f.cubicFeet) <= 0) e.cubicFeet = 'Enter a valid cubic footage.';
  return e;
}

function Field({ id, label, value, onChange, error, type = 'text', placeholder, required = true }: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}{required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        aria-invalid={!!error}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
        style={{ borderColor: error ? '#ef4444' : '#e0d5c8' }} />
      {error && <p className="mt-1.5 text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
}

export default function PostCapacityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = Boolean(editId);

  const [fields, setFields] = useState<CapacityForm>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState('');
  const [loadingEdit, setLoadingEdit] = useState(isEditMode);

  // Fetch existing posting and pre-fill when in edit mode
  useEffect(() => {
    if (!editId) return;
    setLoadingEdit(true);
    fetch(`/api/marketplace/capacity/${editId}/`)
      .then((r) => r.json())
      .then((data) => {
        setFields({
          origin: data.origin ?? '',
          destination: data.destination ?? '',
          availableFrom: data.available_from ?? '',
          availableTo: data.available_to ?? '',
          cubicFeet: String(data.cubic_feet ?? ''),
          equipmentType: data.equipment_type ?? 'Box Truck',
          notes: data.notes ?? '',
        });
      })
      .catch(() => setSubmitError('Failed to load posting. Please go back and try again.'))
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  function set(key: keyof CapacityForm, val: string) {
    setFields((p) => ({ ...p, [key]: val }));
    setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitState('submitting');
    try {
      const url = isEditMode
        ? `/api/marketplace/capacity/${editId}/`
        : '/api/marketplace/capacity/';
      const method = isEditMode ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: fields.origin.trim(), destination: fields.destination.trim(),
          available_from: fields.availableFrom, available_to: fields.availableTo,
          cubic_feet: Number(fields.cubicFeet), equipment_type: fields.equipmentType,
          notes: fields.notes.trim() || null,
        }),
      });
      if (res.ok) {
        if (isEditMode) {
          router.push('/marketplace/carrier/my-capacity');
        } else {
          setSubmitState('success');
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitState('error');
        setSubmitError(data?.detail ?? 'Failed to save. Please try again.');
      }
    } catch {
      setSubmitState('error');
      setSubmitError('Unable to connect. Check your internet and try again.');
    }
  }

  if (submitState === 'success') {
    return (
      <div className="mx-auto max-w-[480px] px-6 py-20 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="mb-2 text-2xl font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Capacity posted</h1>
        <p className="mb-8 text-sm text-neutral-500">Your available capacity is now visible to shippers and brokers on your route.</p>
        <div className="flex flex-col gap-3">
          <Link href="/marketplace/carrier/my-capacity" className="flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]" style={{ background: '#fc3f07' }}>View my postings →</Link>
          <button type="button" onClick={() => { setFields(INITIAL); setSubmitState('idle'); }}
            className="rounded-xl border border-[#e0d5c8] py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]">
            Post another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[560px] px-6 py-10">
      <div className="mb-8">
        <Link href="/marketplace/carrier/my-capacity" className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          My Capacity Postings
        </Link>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
          <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />CARRIER · MARKETPLACE
        </span>
        <h1 className="mt-2 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {isEditMode ? 'Edit capacity posting' : 'Post available capacity'}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {isEditMode ? 'Update your capacity listing details.' : 'Advertise your empty trailer space so shippers and brokers can find you.'}
        </p>
      </div>

      <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm">
        {submitState === 'error' && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {loadingEdit ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-neutral-100" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="origin" label="Origin" value={fields.origin} onChange={(v) => set('origin', v)} error={errors.origin} placeholder="e.g. Chicago, IL" />
              <Field id="destination" label="Destination" value={fields.destination} onChange={(v) => set('destination', v)} error={errors.destination} placeholder="e.g. Detroit, MI" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="availableFrom" label="Available from" type="date" value={fields.availableFrom} onChange={(v) => set('availableFrom', v)} error={errors.availableFrom} />
              <Field id="availableTo" label="Available to" type="date" value={fields.availableTo} onChange={(v) => set('availableTo', v)} error={errors.availableTo} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="cubicFeet" label="Available cubic feet" type="number" value={fields.cubicFeet} onChange={(v) => set('cubicFeet', v)} error={errors.cubicFeet} placeholder="e.g. 1200" />
              <div>
                <label htmlFor="equipmentType" className="mb-1.5 block text-sm font-medium text-neutral-700">Equipment type</label>
                <select id="equipmentType" value={fields.equipmentType} onChange={(e) => set('equipmentType', e.target.value)}
                  className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#fc3f07] appearance-none">
                  {EQUIPMENT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-neutral-700">Notes <span className="text-neutral-400 text-xs">(optional)</span></label>
              <textarea id="notes" value={fields.notes} onChange={(e) => set('notes', e.target.value)} rows={3}
                placeholder="e.g. Flexible on load type, have straps and tarps, prefer LTL…"
                className="w-full resize-none rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20" />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" disabled={submitState === 'submitting'}
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 hover:enabled:bg-[#d93506]"
                style={{ background: '#fc3f07' }}>
                {submitState === 'submitting' ? (
                  <><svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{isEditMode ? 'Saving…' : 'Publishing…'}</>
                ) : isEditMode ? 'Save changes' : 'Publish capacity'}
              </button>
              <Link href="/marketplace/carrier/my-capacity" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">Cancel</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
