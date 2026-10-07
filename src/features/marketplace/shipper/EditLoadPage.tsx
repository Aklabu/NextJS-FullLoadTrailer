'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLoad, patchLoad, type LoadOwnerDetail } from '@/features/marketplace/api/loadsApi';
import { ApiError } from '@/lib/api/client';
import type { PricingMode } from '../types';
import { PRICING_MODE_LABELS } from '../types';
import { EQUIPMENT_OPTIONS } from '@/lib/equipmentOptions';

interface Props {
  id: string;
}

interface LoadForm {
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  cubicFeet: string;
  weight: string;
  equipmentType: string;
  pricingMode: PricingMode;
  fixedPrice: string;
  specialRequirements: string;
}

interface FieldErrors { [k: string]: string }

function validate(f: LoadForm): FieldErrors {
  const e: FieldErrors = {};
  if (!f.origin.trim()) e.origin = 'Origin is required.';
  if (!f.destination.trim()) e.destination = 'Destination is required.';
  if (!f.pickupDate) e.pickupDate = 'Pickup date is required.';
  if (!f.deliveryDate) e.deliveryDate = 'Delivery date is required.';
  else if (f.deliveryDate < f.pickupDate) e.deliveryDate = 'Delivery date must be after pickup date.';
  if (!f.cubicFeet || isNaN(Number(f.cubicFeet)) || Number(f.cubicFeet) <= 0)
    e.cubicFeet = 'Enter a valid cubic footage.';
  if (f.pricingMode === 'fixed') {
    if (!f.fixedPrice || isNaN(Number(f.fixedPrice)) || Number(f.fixedPrice) <= 0)
      e.fixedPrice = 'Enter a valid fixed price.';
  }
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
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} aria-invalid={!!error}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
        style={{ borderColor: error ? '#ef4444' : '#e0d5c8' }} />
      {error && <p className="mt-1.5 text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-neutral-800"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-neutral-400">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-5">
      {[1, 2, 3].map((n) => (
        <div key={n} className="rounded-2xl border border-[#e8e0d6] bg-white p-6">
          <div className="mb-5 h-4 w-32 rounded bg-neutral-100" />
          <div className="space-y-3">
            <div className="h-10 rounded-xl bg-neutral-100" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 rounded-xl bg-neutral-100" />
              <div className="h-10 rounded-xl bg-neutral-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EditLoadPage({ id }: Props) {
  const router = useRouter();

  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const [jobId, setJobId] = useState('');

  const [fields, setFields] = useState<LoadForm>({
    origin: '', destination: '', pickupDate: '', deliveryDate: '',
    cubicFeet: '', weight: '', equipmentType: 'Any equipment',
    pricingMode: 'open_bidding', fixedPrice: '', specialRequirements: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Load existing data to pre-fill the form
  useEffect(() => {
    async function load() {
      try {
        const res = await getLoad(id);
        const d = res.data as LoadOwnerDetail;

        // Guard: only open loads with zero active bids can be edited
        if (d.status !== 'open') {
          setLoadError('Only open loads can be edited.');
          setLoadState('error');
          return;
        }
        if (d.bids.length > 0) {
          setLoadError('Cannot edit a load that has active bids.');
          setLoadState('error');
          return;
        }

        setJobId(d.job_id);
        setFields({
          origin: d.origin,
          destination: d.destination,
          pickupDate: d.pickup_date,
          deliveryDate: d.delivery_date,
          cubicFeet: String(d.cubic_feet),
          weight: d.weight != null ? String(d.weight) : '',
          equipmentType: d.equipment_type,
          pricingMode: d.pricing_mode,
          fixedPrice: d.fixed_price != null ? String(d.fixed_price) : '',
          specialRequirements: d.special_requirements ?? '',
        });
        setLoadState('ready');
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 401) { router.push('/auth/login'); return; }
          setLoadError(err.message || 'Failed to load this load.');
        } else {
          setLoadError('Unable to connect. Check your internet and try again.');
        }
        setLoadState('error');
      }
    }
    load();
  }, [id, router]);

  function set(key: keyof LoadForm, val: string) {
    setFields((p) => ({ ...p, [key]: val }));
    setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  async function handleSave() {
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    setSaveError('');
    try {
      await patchLoad(id, {
        origin: fields.origin.trim(),
        destination: fields.destination.trim(),
        pickup_date: fields.pickupDate,
        delivery_date: fields.deliveryDate,
        cubic_feet: Number(fields.cubicFeet),
        weight: Number(fields.weight) || null,
        equipment_type: fields.equipmentType,
        pricing_mode: fields.pricingMode,
        fixed_price: fields.pricingMode === 'fixed' ? Number(fields.fixedPrice) : null,
        special_requirements: fields.specialRequirements.trim() || null,
      });
      router.push(`/marketplace/loads/${id}`);
    } catch (err) {
      setSaving(false);
      if (err instanceof ApiError) {
        if (err.errors && Object.keys(err.errors).length) {
          const mapped: FieldErrors = {};
          for (const [key, val] of Object.entries(err.errors)) {
            const fk = key
              .replace('pickup_date', 'pickupDate')
              .replace('delivery_date', 'deliveryDate')
              .replace('cubic_feet', 'cubicFeet')
              .replace('fixed_price', 'fixedPrice')
              .replace('equipment_type', 'equipmentType')
              .replace('pricing_mode', 'pricingMode')
              .replace('special_requirements', 'specialRequirements');
            mapped[fk] = Array.isArray(val) ? val[0] : String(val);
          }
          setErrors(mapped);
          setSaveError('Please fix the errors above and try again.');
        } else {
          setSaveError(err.message || 'Failed to save. Please try again.');
        }
      } else {
        setSaveError('Unable to connect. Check your internet and try again.');
      }
    }
  }

  if (loadState === 'loading') {
    return <div className="mx-auto max-w-[640px] px-6 py-10"><Skeleton /></div>;
  }

  if (loadState === 'error') {
    return (
      <div className="mx-auto max-w-[640px] px-6 py-10">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-red-700">{loadError}</p>
            <Link href={`/marketplace/loads/${id}`} className="mt-2 inline-block text-xs font-medium text-red-600 underline underline-offset-2 hover:text-red-800">
              ← Back to load
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[640px] px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link href={`/marketplace/loads/${id}`}
          className="mb-4 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to load
        </Link>
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
          <span className="h-1 w-1 rounded-full bg-[#fc3f07]" aria-hidden="true" />MARKETPLACE
        </span>
        <h1 className="mt-2 text-[clamp(22px,3vw,28px)] font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Edit load
        </h1>
        <p className="mt-1 font-mono text-sm text-neutral-400">{jobId}</p>
      </div>

      {/* Save error banner */}
      {saveError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{saveError}</p>
        </div>
      )}

      <div className="space-y-5">
        {/* Route */}
        <SectionCard title="Route" subtitle="City and state only — full addresses are shared after booking.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="origin" label="Origin" value={fields.origin} onChange={(v) => set('origin', v)} error={errors.origin} placeholder="Chicago, IL" />
            <Field id="destination" label="Destination" value={fields.destination} onChange={(v) => set('destination', v)} error={errors.destination} placeholder="Detroit, MI" />
          </div>
        </SectionCard>

        {/* Dates */}
        <SectionCard title="Schedule">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="pickupDate" label="Pickup date" type="date" value={fields.pickupDate} onChange={(v) => set('pickupDate', v)} error={errors.pickupDate} />
            <Field id="deliveryDate" label="Delivery date" type="date" value={fields.deliveryDate} onChange={(v) => set('deliveryDate', v)} error={errors.deliveryDate} />
          </div>
        </SectionCard>

        {/* Load specs */}
        <SectionCard title="Load specifications">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="cubicFeet" label="Cubic feet" type="number" value={fields.cubicFeet} onChange={(v) => set('cubicFeet', v)} error={errors.cubicFeet} placeholder="e.g. 1200" />
              <Field id="weight" label="Weight (lbs, optional)" type="number" value={fields.weight} onChange={(v) => set('weight', v)} placeholder="e.g. 8000" required={false} />
            </div>
            <div>
              <label htmlFor="equipmentType" className="mb-1.5 block text-sm font-medium text-neutral-700">Equipment type</label>
              <select id="equipmentType" value={fields.equipmentType} onChange={(e) => set('equipmentType', e.target.value)}
                className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-[#fc3f07] appearance-none">
                {EQUIPMENT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="specialRequirements" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Special requirements <span className="text-neutral-400">(optional)</span>
              </label>
              <textarea id="specialRequirements" value={fields.specialRequirements}
                onChange={(e) => set('specialRequirements', e.target.value)} rows={3}
                placeholder="e.g. Liftgate required, fragile items…"
                className="w-full resize-none rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20" />
            </div>
          </div>
        </SectionCard>

        {/* Pricing */}
        <SectionCard title="Pricing mode" subtitle="Choose how carriers submit their offers.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(['open_bidding', 'best_offer', 'fixed'] as PricingMode[]).map((mode) => {
              const descriptions: Record<PricingMode, string> = {
                open_bidding: 'Carriers see each other\'s bids and compete.',
                best_offer: 'Blind bids — carriers submit their best price once.',
                fixed: 'You set the price; carriers accept or pass.',
              };
              return (
                <button key={mode} type="button" onClick={() => set('pricingMode', mode)}
                  aria-pressed={fields.pricingMode === mode}
                  className="flex flex-col rounded-xl border-2 p-4 text-left transition-all"
                  style={{
                    borderColor: fields.pricingMode === mode ? '#fc3f07' : '#e8e0d6',
                    background: fields.pricingMode === mode ? '#fff8f2' : '#fff',
                  }}>
                  <span className="mb-1 text-sm font-semibold text-neutral-800">{PRICING_MODE_LABELS[mode]}</span>
                  <span className="text-xs leading-relaxed text-neutral-400">{descriptions[mode]}</span>
                </button>
              );
            })}
          </div>
          {fields.pricingMode === 'fixed' && (
            <div className="mt-4">
              <Field id="fixedPrice" label="Fixed price (USD)" type="number" value={fields.fixedPrice}
                onChange={(v) => set('fixedPrice', v)} error={errors.fixedPrice} placeholder="e.g. 2500" />
            </div>
          )}
        </SectionCard>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button type="button" disabled={saving} onClick={handleSave}
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 hover:enabled:bg-[#d93506]"
            style={{ background: '#fc3f07' }}>
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : 'Save changes'}
          </button>
          <Link href={`/marketplace/loads/${id}`}
            className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}
