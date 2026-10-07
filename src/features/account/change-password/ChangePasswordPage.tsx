'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/features/auth/api/authApi';
import { ApiError } from '@/lib/api/client';

type PageState = 'idle' | 'loading' | 'error' | 'success';

function EyeOpen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

interface PasswordInput {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}

function PasswordField({ id, label, value, onChange, show, onToggle, placeholder, error, hint, disabled }: PasswordInput) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</label>
      {hint && <p className="mb-2 text-xs text-neutral-400">{hint}</p>}
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={id === 'old_password' ? 'current-password' : 'new-password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '••••••••'}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20 disabled:opacity-60"
          style={{ borderColor: error ? '#ef4444' : '#e0d5c8' }}
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
        >
          {show ? <EyeOff /> : <EyeOpen />}
        </button>
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
}

export default function ChangePasswordPage() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [pageState, setPageState] = useState<PageState>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  function clearFieldError(key: string) {
    setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }

  // Password strength
  function strength(pw: string): { level: 1 | 2 | 3 | 4; label: string } | null {
    if (!pw) return null;
    if (pw.length < 8) return { level: 1, label: 'Weak' };
    if (pw.length >= 12 && /[^a-zA-Z0-9]/.test(pw) && /[A-Z]/.test(pw)) return { level: 4, label: 'Strong' };
    if (pw.length >= 10 && (/[^a-zA-Z0-9]/.test(pw) || /[A-Z]/.test(pw))) return { level: 3, label: 'Good' };
    return { level: 2, label: 'Fair' };
  }

  const newStrength = strength(newPassword);
  const confirmMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side guard
    const errs: Record<string, string> = {};
    if (!oldPassword) errs.old_password = 'Current password is required.';
    if (!newPassword) errs.new_password = 'New password is required.';
    else if (newPassword.length < 8) errs.new_password = 'Password must be at least 8 characters.';
    if (!confirmPassword) errs.confirm_password = 'Please confirm your new password.';
    else if (newPassword !== confirmPassword) errs.confirm_password = 'Passwords do not match.';
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setPageState('loading');
    setFieldErrors({});
    setGeneralError('');

    try {
      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setPageState('success');
    } catch (err) {
      setPageState('error');
      if (err instanceof ApiError && err.errors) {
        // Map each API field error to local state
        const mapped: Record<string, string> = {};
        for (const [key, val] of Object.entries(err.errors)) {
          mapped[key] = Array.isArray(val) ? val[0] : (val as string);
        }
        setFieldErrors(mapped);
      } else if (err instanceof ApiError) {
        setGeneralError(err.message);
      } else {
        setGeneralError('Unable to connect. Check your internet and try again.');
      }
    }
  }

  const isLoading = pageState === 'loading';

  // Success screen
  if (pageState === 'success') {
    return (
      <div className="mx-auto max-w-[480px] px-6 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1
          className="mb-2 text-2xl font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Password changed
        </h1>
        <p className="mb-8 text-sm text-neutral-500">
          Password changed successfully. Use your new password next time you log in.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
          style={{ background: '#fc3f07' }}
        >
          Back to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[480px] px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/profile"
          className="mb-5 flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to profile
        </Link>
        <h1
          className="text-[clamp(22px,3vw,28px)] font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Change password
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Choose a strong password you haven&apos;t used before.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm">

        {/* General error banner */}
        {pageState === 'error' && generalError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          <PasswordField
            id="old_password"
            label="Current password"
            value={oldPassword}
            onChange={(v) => { setOldPassword(v); clearFieldError('old_password'); }}
            show={showOld}
            onToggle={() => setShowOld((s) => !s)}
            error={fieldErrors.old_password}
            disabled={isLoading}
          />

          <div className="h-px bg-[#e8e0d6]" />

          <PasswordField
            id="new_password"
            label="New password"
            value={newPassword}
            onChange={(v) => { setNewPassword(v); clearFieldError('new_password'); }}
            show={showNew}
            onToggle={() => setShowNew((s) => !s)}
            placeholder="Min. 8 characters"
            error={fieldErrors.new_password}
            disabled={isLoading}
          />

          {/* Strength meter */}
          {newStrength && (
            <div className="-mt-2 flex items-center gap-2">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="h-1 flex-1 rounded-full transition-colors"
                  style={{
                    background: level <= newStrength.level
                      ? newStrength.level >= 3 ? '#22c55e' : newStrength.level === 2 ? '#f59e0b' : '#ef4444'
                      : '#e8e0d6',
                  }}
                />
              ))}
              <span className="text-[11px] text-neutral-400">{newStrength.label}</span>
            </div>
          )}

          <PasswordField
            id="confirm_password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(v) => { setConfirmPassword(v); clearFieldError('confirm_password'); }}
            show={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
            placeholder="Repeat your password"
            error={fieldErrors.confirm_password ?? (confirmMismatch ? "Passwords don't match." : undefined)}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506]"
            style={{ background: '#fc3f07' }}
          >
            {isLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating…
              </>
            ) : 'Update password'}
          </button>

        </form>
      </div>

      {/* Forgot password fallback */}
      <p className="mt-5 text-center text-xs text-neutral-400">
        Don&apos;t remember your current password?{' '}
        <Link href="/auth/forgot-password" className="font-medium text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
          Reset via email instead
        </Link>
      </p>

    </div>
  );
}
