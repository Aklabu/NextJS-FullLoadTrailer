'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VerificationBadge from '@/components/VerificationBadge';
import { getMe, patchMe, logout } from '@/features/auth/api/authApi';
import { getRefreshToken, clearTokens } from '@/lib/api/tokens';
import { ApiError } from '@/lib/api/client';
import type { VerificationStatus, UserRole } from '@/lib/types/auth';

// Editable fields — maps 1-to-1 with patchMe snake_case keys
interface ProfileFields {
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  website: string;
}

// Read-only identity
interface ProfileMeta {
  email: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type LoadState = 'loading' | 'error' | 'ready';

function Field({
  id, label, value, onChange, type = 'text', placeholder, disabled,
}: {
  id: string; label: string; value: string; onChange?: (v: string) => void;
  type?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
      <input
        id={id} type={type} value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder} disabled={disabled}
        readOnly={!onChange}
        className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:bg-neutral-50 disabled:text-neutral-400 read-only:bg-neutral-50 read-only:text-neutral-400"
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

const ROLE_LABELS: Record<UserRole, string> = {
  shipper: 'Shipper / Moving Company',
  broker: 'Freight Broker',
  carrier: 'Carrier / Owner-Operator',
};

const STATUS_DESCRIPTIONS: Record<VerificationStatus, string> = {
  verified: 'Your account is fully verified. You have access to the Bulletin Board and Marketplace.',
  basic: 'You have Bulletin Board access. Upgrade to Advanced verification to unlock the Marketplace.',
  pending: 'Your documents are under review. This usually takes 1–2 business days.',
  needs_info: 'Our team has requested additional information. Check your verification status.',
  rejected: 'Your application was not approved. Please review the reason and resubmit.',
  unverified: 'Your account has not been submitted for verification yet.',
};

export default function ProfilePage() {
  const router = useRouter();

  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [loadError, setLoadError] = useState('');

  const [fields, setFields] = useState<ProfileFields>({
    name: '', phone: '', address_line1: '', address_line2: '',
    city: '', state: '', zip_code: '', website: '',
  });
  const [meta, setMeta] = useState<ProfileMeta>({
    email: '', role: 'shipper', verificationStatus: 'unverified',
  });

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');

  // Load profile on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await getMe();
        const d = res.data;
        setFields({
          name: d.name,
          phone: d.phone,
          address_line1: d.address_line1,
          address_line2: d.address_line2 ?? '',
          city: d.city,
          state: d.state,
          zip_code: d.zip_code,
          website: d.website ?? '',
        });
        setMeta({
          email: d.email,
          role: d.role,
          verificationStatus: d.verification_status,
        });
        setLoadState('ready');
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.push('/auth/login');
        } else {
          setLoadError('Unable to load your profile. Please refresh the page.');
          setLoadState('error');
        }
      }
    }
    load();
  }, [router]);

  function setField(key: keyof ProfileFields, value: string) {
    setFields((p) => ({ ...p, [key]: value }));
    if (saveState === 'saved' || saveState === 'error') setSaveState('idle');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveState('saving');
    setSaveError('');
    try {
      const res = await patchMe({
        name: fields.name,
        phone: fields.phone,
        address_line1: fields.address_line1,
        address_line2: fields.address_line2 || undefined,
        city: fields.city,
        state: fields.state,
        zip_code: fields.zip_code,
        website: fields.website || undefined,
      });
      // Update local fields from the returned profile
      const d = res.data;
      setFields({
        name: d.name,
        phone: d.phone,
        address_line1: d.address_line1,
        address_line2: d.address_line2 ?? '',
        city: d.city,
        state: d.state,
        zip_code: d.zip_code,
        website: d.website ?? '',
      });
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err) {
      setSaveState('error');
      if (err instanceof ApiError) {
        // Surface first field error or the message
        const firstFieldErr = err.errors
          ? (Object.values(err.errors).flat()[0] as string)
          : null;
        setSaveError(firstFieldErr ?? err.message);
      } else {
        setSaveError('Unable to connect. Check your internet and try again.');
      }
    }
  }

  const isSaving = saveState === 'saving';

  // Loading state
  if (loadState === 'loading') {
    return (
      <div className="mx-auto max-w-[600px] px-6 py-10">
        <Skeleton />
      </div>
    );
  }

  // Load error state
  if (loadState === 'error') {
    return (
      <div className="mx-auto max-w-[600px] px-6 py-10">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{loadError}</p>
        </div>
      </div>
    );
  }

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
          <VerificationBadge status={meta.verificationStatus} />
          <span className="text-[11px] text-neutral-400">{ROLE_LABELS[meta.role]}</span>
        </div>
      </div>

      {/* Company info form */}
      <SectionCard title="Company information">
        <form onSubmit={handleSave} noValidate className="space-y-4">

          <Field id="name" label="Company / Business name"
            value={fields.name} onChange={(v) => setField('name', v)}
            placeholder="Acme Freight LLC" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Email is locked — not editable per API spec */}
            <Field id="email" label="Business email (locked)" type="email"
              value={meta.email} disabled />
            <Field id="phone" label="Phone" type="tel"
              value={fields.phone} onChange={(v) => setField('phone', v)}
              placeholder="+1 (555) 000-0000" />
          </div>

          <Field id="address_line1" label="Street address"
            value={fields.address_line1} onChange={(v) => setField('address_line1', v)}
            placeholder="123 Main St" />

          <Field id="address_line2" label="Address line 2 (optional)"
            value={fields.address_line2} onChange={(v) => setField('address_line2', v)}
            placeholder="Suite 400" />

          <div className="grid grid-cols-2 gap-4">
            <Field id="city" label="City"
              value={fields.city} onChange={(v) => setField('city', v)} />
            <div className="grid grid-cols-2 gap-3">
              <Field id="state" label="State"
                value={fields.state} onChange={(v) => setField('state', v)} placeholder="IL" />
              <Field id="zip_code" label="ZIP"
                value={fields.zip_code} onChange={(v) => setField('zip_code', v)} placeholder="60601" />
            </div>
          </div>

          <Field id="website" label="Website (optional)" type="url"
            value={fields.website} onChange={(v) => setField('website', v)}
            placeholder="https://yourcompany.com" />

          {/* Error banner */}
          {saveState === 'error' && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700" role="alert">{saveError}</p>
            </div>
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
              <span className="flex items-center gap-1.5 text-sm text-emerald-600" role="status">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Saved ✓
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
            <p className="text-xs text-neutral-400 mt-0.5">Use the link to reset via email OTP.</p>
          </div>
          <Link
            href="/profile/change-password"
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
            <VerificationBadge status={meta.verificationStatus} />
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              {STATUS_DESCRIPTIONS[meta.verificationStatus]}
            </p>
          </div>
          {meta.verificationStatus !== 'verified' && (
            <Link
              href="/auth/verify-status"
              className="shrink-0 rounded-xl border border-[#e0d5c8] px-4 py-2 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07]"
            >
              Check status
            </Link>
          )}
        </div>
      </SectionCard>

      {/* Account */}
      <SectionCard title="Account">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-700">Log out</p>
            <p className="text-xs text-neutral-400 mt-0.5">Sign out of your account on this device.</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              const refresh = getRefreshToken();
              if (refresh) await logout(refresh);
              clearTokens();
              window.location.href = '/';
            }}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </SectionCard>

    </div>
  );
}
