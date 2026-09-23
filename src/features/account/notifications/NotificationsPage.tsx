'use client';

import { useState } from 'react';

interface NotificationPref {
  key: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const INITIAL_PREFS: NotificationPref[] = [
  { key: 'new_bid', label: 'New bid received', description: 'When a carrier places a bid on your load.', email: true, inApp: true },
  { key: 'counteroffer', label: 'Counteroffer', description: 'When a shipper or carrier sends a counter on your bid.', email: true, inApp: true },
  { key: 'bid_accepted', label: 'Bid accepted', description: 'When your bid or counteroffer is accepted.', email: true, inApp: true },
  { key: 'bid_rejected', label: 'Bid rejected', description: 'When your bid or counteroffer is declined.', email: false, inApp: true },
  { key: 'booking_confirmed', label: 'Booking confirmed', description: 'When a load is booked and a Job ID is generated.', email: true, inApp: true },
  { key: 'new_message', label: 'New message', description: 'When you receive an in-platform message on a job.', email: true, inApp: true },
  { key: 'verification_update', label: 'Verification update', description: 'Changes to your verification status (approved, rejected, needs info).', email: true, inApp: true },
  { key: 'new_capacity_post', label: 'New capacity post', description: 'When a carrier posts capacity on a route you watch.', email: false, inApp: false },
  { key: 'load_expiring', label: 'Load expiring soon', description: 'A reminder before your posted load expires.', email: true, inApp: false },
  { key: 'platform_updates', label: 'Platform updates', description: 'News about new features and policy changes.', email: false, inApp: true },
];

const GROUPS = [
  { label: 'Marketplace activity', keys: ['new_bid', 'counteroffer', 'bid_accepted', 'bid_rejected', 'booking_confirmed'] },
  { label: 'Messages & communication', keys: ['new_message'] },
  { label: 'Account & verification', keys: ['verification_update', 'load_expiring'] },
  { label: 'Discovery', keys: ['new_capacity_post', 'platform_updates'] },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#fc3f07]"
      style={{ background: checked ? '#fc3f07' : '#e8e0d6' }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
        aria-hidden="true"
      />
    </button>
  );
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPref[]>(INITIAL_PREFS);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState('');

  function updatePref(key: string, channel: 'email' | 'inApp', value: boolean) {
    setPrefs((prev) => prev.map((p) => p.key === key ? { ...p, [channel]: value } : p));
    if (saveState === 'saved' || saveState === 'error') setSaveState('idle');
  }

  function toggleAllForChannel(channel: 'email' | 'inApp', value: boolean) {
    setPrefs((prev) => prev.map((p) => ({ ...p, [channel]: value })));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveState('saving');
    setSaveError('');
    try {
      const payload = prefs.reduce<Record<string, { email: boolean; in_app: boolean }>>((acc, p) => {
        acc[p.key] = { email: p.email, in_app: p.inApp };
        return acc;
      }, {});

      const res = await fetch('/api/accounts/me/notification-preferences/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 3000);
      } else {
        setSaveState('error');
        setSaveError('Save failed. Please try again.');
      }
    } catch {
      setSaveState('error');
      setSaveError('Unable to connect. Check your internet and try again.');
    }
  }

  const isSaving = saveState === 'saving';

  return (
    <div className="mx-auto max-w-[620px] space-y-6 px-6 py-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(22px,3vw,28px)] font-normal text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Notification Preferences
          </h1>
          <p className="mt-1 text-sm text-neutral-500">Choose how you want to be notified about activity on your account.</p>
        </div>
      </div>

      <form onSubmit={handleSave} noValidate>

        {/* Column headers */}
        <div className="mb-3 flex items-center justify-end gap-8 px-2 pr-4">
          <div className="flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">Email</span>
            <button type="button" onClick={() => toggleAllForChannel('email', !prefs.every((p) => p.email))}
              className="text-[9px] text-[#fc3f07] underline underline-offset-1 hover:text-[#d93506]">
              {prefs.every((p) => p.email) ? 'None' : 'All'}
            </button>
          </div>
          <div className="flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-[1px] text-neutral-400">In-app</span>
            <button type="button" onClick={() => toggleAllForChannel('inApp', !prefs.every((p) => p.inApp))}
              className="text-[9px] text-[#fc3f07] underline underline-offset-1 hover:text-[#d93506]">
              {prefs.every((p) => p.inApp) ? 'None' : 'All'}
            </button>
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-4">
          {GROUPS.map((group) => {
            const groupPrefs = prefs.filter((p) => group.keys.includes(p.key));
            return (
              <div key={group.label} className="rounded-2xl border border-[#e8e0d6] bg-white shadow-sm overflow-hidden">
                <div className="border-b border-[#f0ece6] bg-[#fafaf8] px-5 py-2.5">
                  <p className="text-xs font-semibold uppercase tracking-[1px] text-neutral-400">{group.label}</p>
                </div>
                <div className="divide-y divide-[#f5f2ee]">
                  {groupPrefs.map((pref) => (
                    <div key={pref.key} className="flex items-center gap-4 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800">{pref.label}</p>
                        <p className="text-xs leading-relaxed text-neutral-400">{pref.description}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-8">
                        <Toggle
                          checked={pref.email}
                          onChange={(v) => updatePref(pref.key, 'email', v)}
                          label={`Email for ${pref.label}`}
                        />
                        <Toggle
                          checked={pref.inApp}
                          onChange={(v) => updatePref(pref.key, 'inApp', v)}
                          label={`In-app for ${pref.label}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Error */}
        {saveState === 'error' && (
          <p className="mt-4 text-sm text-red-600" role="alert">{saveError}</p>
        )}

        {/* Save */}
        <div className="mt-6 flex items-center gap-3">
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
            ) : 'Save preferences'}
          </button>
          {saveState === 'saved' && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Preferences saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
