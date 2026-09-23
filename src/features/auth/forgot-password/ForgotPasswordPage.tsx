'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Step 1 — enter email
// Step 2 — enter 6-digit OTP
// Step 3 — set new password
type Step = 1 | 2 | 3;
type StepState = 'idle' | 'loading' | 'error' | 'success';

const STEPS = [
  { n: 1, label: 'Email' },
  { n: 2, label: 'Verify OTP' },
  { n: 3, label: 'New Password' },
];

// Eye icons
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

// OTP 6-box input
function OtpInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = digits.map((d, idx) => (idx === i ? '' : d)).join('');
        onChange(next);
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
        const next = digits.map((d, idx) => (idx === i - 1 ? '' : d)).join('');
        onChange(next);
      }
      return;
    }
    if (e.key === 'ArrowLeft' && i > 0) { inputs.current[i - 1]?.focus(); return; }
    if (e.key === 'ArrowRight' && i < 5) { inputs.current[i + 1]?.focus(); return; }
  }

  function handleInput(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = digits.map((d, idx) => (idx === i ? char : d)).join('');
    onChange(next);
    if (char && i < 5) inputs.current[i + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) { onChange(pasted.padEnd(6, '').slice(0, 6)); inputs.current[Math.min(pasted.length, 5)]?.focus(); }
    e.preventDefault();
  }

  return (
    <div className="flex gap-2.5" role="group" aria-label="One-time password">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleInput(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="h-14 w-12 rounded-xl border border-[#e0d5c8] bg-white text-center font-mono text-xl font-bold text-neutral-900 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:opacity-60"
          style={{ caretColor: 'transparent' }}
        />
      ))}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [stepState, setStepState] = useState<StepState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1
  const [email, setEmail] = useState('');

  // Step 2
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 3
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function clearError() {
    if (stepState === 'error') { setStepState('idle'); setErrorMsg(''); }
  }

  // Step 1 — send OTP
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStepState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/accounts/password/forgot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStep(2);
        setStepState('idle');
        setResendCooldown(60);
      } else {
        const data = await res.json().catch(() => ({}));
        setStepState('error');
        setErrorMsg(data?.detail ?? data?.email?.[0] ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setStepState('error');
      setErrorMsg('Unable to connect. Check your internet and try again.');
    }
  }

  // Step 2 — verify OTP (move to step 3 on success)
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (otp.replace(/\D/g, '').length < 6) return;
    setStepState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/accounts/password/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp }),
      });
      if (res.ok) {
        setStep(3);
        setStepState('idle');
      } else {
        const data = await res.json().catch(() => ({}));
        setStepState('error');
        setOtp('');
        setErrorMsg(data?.detail ?? 'Invalid or expired code. Please try again.');
      }
    } catch {
      setStepState('error');
      setErrorMsg('Unable to connect. Check your internet and try again.');
    }
  }

  // Resend OTP
  async function handleResend() {
    if (resendCooldown > 0) return;
    setOtp('');
    setStepState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/accounts/password/forgot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStepState(res.ok ? 'idle' : 'error');
      if (!res.ok) setErrorMsg('Failed to resend. Please try again.');
      else setResendCooldown(60);
    } catch {
      setStepState('error');
      setErrorMsg('Unable to connect.');
    }
  }

  // Step 3 — reset password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password || password !== confirmPassword) return;
    if (password.length < 8) { setStepState('error'); setErrorMsg('Password must be at least 8 characters.'); return; }
    setStepState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/accounts/password/reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp, new_password: password }),
      });
      if (res.ok) {
        setStepState('success');
      } else {
        const data = await res.json().catch(() => ({}));
        setStepState('error');
        setErrorMsg(data?.detail ?? data?.new_password?.[0] ?? 'Reset failed. Please try again.');
      }
    } catch {
      setStepState('error');
      setErrorMsg('Unable to connect. Check your internet and try again.');
    }
  }

  const isLoading = stepState === 'loading';

  // Success screen
  if (stepState === 'success') {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-6"
        style={{ background: 'radial-gradient(circle at 20% 10%, #fbe3c4, transparent 50%), radial-gradient(circle at 85% 15%, #f6d9d3, transparent 50%), #fdf6ee' }}
      >
        <div className="w-full max-w-[420px] text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1
            className="mb-3 text-2xl font-normal text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Password updated
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-neutral-500">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <button
            type="button"
            onClick={() => router.push('/auth/login')}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#d93506]"
            style={{ background: '#fc3f07' }}
          >
            Go to Login
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: 'radial-gradient(circle at 20% 10%, #fbe3c4, transparent 50%), radial-gradient(circle at 85% 15%, #f6d9d3, transparent 50%), #fdf6ee' }}
    >
      {/* Top bar */}
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2" aria-label="FullLoadTrailer home">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
            style={{ background: '#ff3d03', color: '#1A1953' }}
            aria-hidden="true"
          >
            FL
          </span>
          <span className="text-base font-semibold tracking-tight text-neutral-900">
            FullLoad<span style={{ color: '#fc3f07' }}>Trailer</span>
          </span>
        </Link>
        <span className="text-sm text-neutral-500">
          Remember your password?{' '}
          <Link href="/auth/login" className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
            Log in
          </Link>
        </span>
      </div>

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">

          {/* Header */}
          <div className="mb-8">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#fc3f07]" />
              PASSWORD RECOVERY
            </span>
            <h1
              className="mt-4 text-[clamp(24px,4vw,32px)] font-normal leading-tight text-neutral-900"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {step === 1 && 'Reset your password'}
              {step === 2 && 'Enter your OTP code'}
              {step === 3 && 'Create a new password'}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">
              {step === 1 && "We'll send a one-time code to your email."}
              {step === 2 && (
                <>
                  Code sent to <span className="font-medium text-neutral-700">{email}</span>.
                </>
              )}
              {step === 3 && 'Choose a strong password for your account.'}
            </p>
          </div>

          {/* Step progress */}
          <div className="mb-8 flex items-center gap-0">
            {STEPS.map((s, i) => {
              const done = step > s.n;
              const active = step === s.n;
              return (
                <div key={s.n} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors"
                      style={{
                        background: done ? '#fc3f07' : active ? '#2b1508' : '#e8e0d6',
                        color: done || active ? '#fff' : '#a09080',
                      }}
                    >
                      {done ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : s.n}
                    </div>
                    <span className="text-[10px] font-medium text-neutral-400">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="mb-5 mx-1.5 h-0.5 flex-1 rounded-full transition-colors"
                      style={{ background: step > s.n ? '#fc3f07' : '#e8e0d6' }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Error banner */}
          {stepState === 'error' && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          {/* ── STEP 1 — Email ── */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} noValidate className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  disabled={isLoading}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506]"
                style={{ background: '#fc3f07' }}
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending code…
                  </>
                ) : 'Send reset code'}
              </button>
              <p className="text-center text-[13px] text-neutral-400">
                Back to{' '}
                <Link href="/auth/login" className="text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
                  Log in
                </Link>
              </p>
            </form>
          )}

          {/* ── STEP 2 — OTP ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} noValidate className="space-y-6">
              <div>
                <label className="mb-4 block text-sm font-medium text-neutral-700">
                  6-digit code
                </label>
                <OtpInput value={otp} onChange={(v) => { setOtp(v); clearError(); }} disabled={isLoading} />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.replace(/\D/g, '').length < 6}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506]"
                style={{ background: '#fc3f07' }}
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying…
                  </>
                ) : 'Verify code'}
              </button>

              {/* Resend */}
              <div className="text-center text-[13px] text-neutral-400">
                Didn&apos;t receive it?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isLoading}
                  className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506] disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); setStepState('idle'); setErrorMsg(''); }}
                className="flex w-full items-center justify-center gap-1.5 text-[13px] text-neutral-400 hover:text-neutral-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Change email address
              </button>
            </form>
          )}

          {/* ── STEP 3 — New password ── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} noValidate className="space-y-5">
              {/* New password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    disabled={isLoading}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {/* Strength hint */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    {[1, 2, 3, 4].map((level) => {
                      const strength = password.length >= 12 && /[^a-zA-Z0-9]/.test(password) ? 4
                        : password.length >= 10 ? 3
                        : password.length >= 8 ? 2
                        : 1;
                      return (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-colors"
                          style={{ background: level <= strength ? (strength >= 3 ? '#22c55e' : strength === 2 ? '#f59e0b' : '#ef4444') : '#e8e0d6' }}
                        />
                      );
                    })}
                    <span className="text-[11px] text-neutral-400">
                      {password.length >= 12 && /[^a-zA-Z0-9]/.test(password) ? 'Strong'
                        : password.length >= 10 ? 'Good'
                        : password.length >= 8 ? 'Fair'
                        : 'Weak'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                    disabled={isLoading}
                    placeholder="Repeat your password"
                    className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:opacity-60"
                    style={{ borderColor: confirmPassword && password !== confirmPassword ? '#ef4444' : undefined }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">Passwords don&apos;t match.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !password || password !== confirmPassword || password.length < 8}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506]"
                style={{ background: '#fc3f07' }}
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting password…
                  </>
                ) : 'Reset password'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
