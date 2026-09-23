'use client';

import { useState } from 'react';
import Link from 'next/link';
import VerificationBadge from '@/components/VerificationBadge';
import type { VerificationStatus, UserRole } from '@/lib/types/auth';

interface ProfileFields {
  companyName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  website: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

// Mock — replace with real API data
const MOCK: ProfileFields = {
  companyName: 'Acme Freight LLC',
  email: 'ops@acmefreight.com',
  phone: '+1 (312) 555-0100',
  addressLine1: '123 Main St, Suite 400',
  city: 'Chicago',
  state: 'IL',
  zip: '60601',
  website: 'https://acmefreight.com',
};

const MOCK_STATUS: VerificationStatus = 'verified';
const MOCK_ROLE: UserRole = 'shipper';

function Field({
  id, label, value, onChange, type = 'text', placeholder, disabled,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:bg-neutral-50 disabled:text-neutral-400"
      />
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e8e0d6] bg-white p-6 shadow-sm">
      <h2
        className="mb-5 text-base font-semibold text-neutral-800"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const [fields, setFields] = useState<ProfileFields>(MOCK);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');

  function setField(key: keyof ProfileFields, value: string) {
    setFields((p) => ({ ...p, [key]: value }));
    if (saveState === 'saved' || saveState === 'error') setSaveState('idle');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveState('saving');
    setSaveError('');
    try {
      const res = await fetch('/api/accounts/me/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveState('error');
        setSaveError(data?.detail ?? 'Save failed. Please try again.');
      }
    } catch {
      setSaveState('error');
      setSaveError('Unable to connect. Check your internet and try again.');
    }
  }

  const isSaving = saveState === 'saving';

  return (
    <div className="mx-auto max-w-[600px] space-y-6 px-6 py-10">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(22px,3vw,28px)] font-normal text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Company Settings
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Manage your company info and account details.</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <VerificationBadge status={MOCK_STATUS} />
          <span className="text-[11px] text-neutral-400 capitalize">{MOCK_ROLE}</span>
        </div>
      </div>

      {/* Company info form */}
      <SectionCard title="Company information">
        <form onSubmit={handleSave} noValidate className="space-y-4">

          <Field id="companyName" label="Company / Business name"
            value={fields.companyName} onChange={(v) => setField('companyName', v)}
            placeholder="Acme Freight LLC" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="email" label="Business email" type="email"
              value={fields.email} onChange={(v) => setField('email', v)}
              placeholder="ops@company.com" />
            <Field id="phone" label="Phone" type="tel"
              value={fields.phone} onChange={(v) => setField('phone', v)}
              placeholder="+1 (555) 000-0000" />
          </div>

          <Field id="addressLine1" label="Street address"
            value={fields.addressLine1} onChange={(v) => setField('addressLine1', v)}
            placeholder="123 Main St" />

          <div className="grid grid-cols-2 gap-4">
            <Field id="city" label="City"
              value={fields.city} onChange={(v) => setField('city', v)} />
            <div className="grid grid-cols-2 gap-3">
              <Field id="state" label="State"
                value={fields.state} onChange={(v) => setField('state', v)} placeholder="IL" />
              <Field id="zip" label="ZIP"
                value={fields.zip} onChange={(v) => setField('zip', v)} placeholder="60601" />
            </div>
          </div>

          <Field id="website" label="Website (optional)" type="url"
            value={fields.website} onChange={(v) => setField('website', v)}
            placeholder="https://yourcompany.com" />

          {/* Error */}
          {saveState === 'error' && (
            <p className="text-sm text-red-600" role="alert">{saveError}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60 hover:enabled:bg-[#d93506]"
              style={{ background: '#fc3f07' }}
            >
              {isSaving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : 'Save changes'}
            </button>
            {saveState === 'saved' && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Saved
              </span>
            )}
          </div>
        </form>
      </SectionCard>

      {/* Password */}
      <SectionCard title="Password & security">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-700">Password</p>
            <p className="text-xs text-neutral-400 mt-0.5">Last changed: never</p>
          </div>
          <Link
            href="/auth/forgot-password"
            className="rounded-xl border border-[#e0d5c8] px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
          >
            Change password
          </Link>
        </div>
      </SectionCard>

      {/* Verification status */}
      <SectionCard title="Verification status">
        <div className="flex items-start justify-between gap-4">
          <div>
            <VerificationBadge status={MOCK_STATUS} />
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              {MOCK_STATUS === 'verified'
                ? 'Your account is fully verified. You have access to the Bulletin Board and Marketplace.'
                : 'Your account is pending review. Some features may be restricted.'}
            </p>
          </div>
          {MOCK_STATUS !== 'verified' && (
            <Link
              href="/auth/verify-status"
              className="shrink-0 rounded-xl border border-[#e0d5c8] px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
            >
              Check status
            </Link>
          )}
        </div>
      </SectionCard>

      {/* Danger zone */}
      <SectionCard title="Account">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-700">Log out</p>
            <p className="text-xs text-neutral-400 mt-0.5">Sign out of your account on this device.</p>
          </div>
          <button
            type="button"
            onClick={() => { window.location.href = '/'; }}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </SectionCard>

    </div>
  );
}
