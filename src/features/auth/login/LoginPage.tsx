'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type LoginState = 'idle' | 'loading' | 'error' | 'unverified';

interface FormFields {
  email: string;
  password: string;
}

const BRAND_STATS = [
  { value: '2,400+', label: 'Loads posted monthly' },
  { value: '99.4%', label: 'Verified carrier network' },
  { value: '14 min', label: 'Avg first counteroffer' },
];

export default function LoginPage() {
  const router = useRouter();
  const [fields, setFields] = useState<FormFields>({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (loginState === 'error' || loginState === 'unverified') {
      setLoginState('idle');
      setErrorMessage('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.email.trim() || !fields.password) return;

    setLoginState('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/accounts/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: fields.email.trim(), password: fields.password }),
      });

      if (res.ok) {
        // TODO: store JWT tokens from res.json() in cookie/context
        router.push('/dashboard');
        return;
      }

      const data = await res.json().catch(() => ({}));

      // Django returns 403 + specific code for unverified accounts
      if (res.status === 403 || data?.code === 'account_not_verified') {
        setLoginState('unverified');
        return;
      }

      // 401 / 400 — bad credentials
      setLoginState('error');
      setErrorMessage(
        data?.detail ?? data?.non_field_errors?.[0] ?? 'Invalid email or password.'
      );
    } catch {
      setLoginState('error');
      setErrorMessage('Unable to connect. Check your internet and try again.');
    }
  }

  const isLoading = loginState === 'loading';

  return (
    <div className="flex min-h-screen">

      {/* Left — brand panel */}
      <div
        className="hidden lg:flex lg:w-[42%] flex-col justify-between px-12 py-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(180,80,10,0.5) 0%, transparent 70%), #2b1508',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="FullLoadTrailer home">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
            style={{ background: '#FFCB56', color: '#1A1953' }}
            aria-hidden="true"
          >
            FL
          </span>
          <span className="text-base font-semibold tracking-tight text-white">
            FullLoad<span style={{ color: '#FFCB56' }}>Trailer</span>
          </span>
        </Link>

        {/* Center copy */}
        <div>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fc3f07]" />
            FREIGHT EXCHANGE PLATFORM
          </span>

          <h2
            className="mt-5 text-[clamp(28px,3vw,38px)] font-normal leading-[1.2] text-white"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Full Trailer Loads.
            <br />
            Real Carriers.
            <br />
            <span className="italic text-[#fc3f07]">Zero Friction.</span>
          </h2>

          <p className="mt-5 max-w-[320px] text-sm leading-relaxed text-white/60">
            From community bulletin board to binding rate handshakes — everything on one verified platform.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {BRAND_STATS.map((s) => (
              <div key={s.label}>
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="mt-0.5 text-[11px] leading-tight text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust line */}
        <p className="text-[11px] text-white/30">
          Verified carriers · Binding rate confirmations · In-platform messaging
        </p>
      </div>

      {/* Right — form panel */}
      <div
        className="flex flex-1 flex-col"
        style={{
          background:
            'radial-gradient(circle at 20% 10%, #fbe3c4, transparent 50%), radial-gradient(circle at 85% 15%, #f6d9d3, transparent 50%), #fdf6ee',
        }}
      >
        {/* Mobile logo bar */}
        <div className="flex items-center justify-between px-6 py-5 lg:hidden">
          <Link href="/" className="flex items-center gap-2" aria-label="FullLoadTrailer home">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
              style={{ background: '#FFCB56', color: '#1A1953' }}
              aria-hidden="true"
            >
              FL
            </span>
            <span className="text-base font-semibold tracking-tight text-neutral-900">
              FullLoad<span style={{ color: '#fc3f07' }}>Trailer</span>
            </span>
          </Link>
          <span className="text-sm text-neutral-500">
            No account?{' '}
            <Link href="/auth/signup" className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
              Sign up
            </Link>
          </span>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-[420px]">

            {/* Header */}
            <div className="mb-8">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#fc3f07]" />
                WELCOME BACK
              </span>
              <h1
                className="mt-4 text-[clamp(26px,4vw,34px)] font-normal leading-tight text-neutral-900"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Log in to your account
              </h1>
              <p className="mt-2 text-sm text-neutral-500">
                Don&apos;t have one?{' '}
                <Link href="/auth/signup" className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]">
                  Create an account
                </Link>
              </p>
            </div>

            {/* Unverified state banner */}
            {loginState === 'unverified' && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <p className="font-semibold text-amber-800">Account pending verification</p>
                  <p className="mt-0.5 text-amber-700">
                    Your account is still under review.{' '}
                    <Link href="/auth/verify-status" className="font-semibold underline underline-offset-2 hover:text-amber-900">
                      Check your status →
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Error banner */}
            {loginState === 'error' && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Email */}
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
                  value={fields.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-medium text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]"
                    tabIndex={0}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={fields.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !fields.email.trim() || !fields.password}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506] hover:enabled:scale-[1.01]"
                style={{ background: '#fc3f07' }}
              >
                {isLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Log In
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e8e0d6]" />
              <span className="text-[11px] font-medium uppercase tracking-[1px] text-neutral-400">
                New to FullLoadTrailer?
              </span>
              <div className="h-px flex-1 bg-[#e8e0d6]" />
            </div>

            {/* Sign-up nudge */}
            <Link
              href="/auth/signup"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e0d5c8] bg-white py-3.5 text-sm font-semibold text-neutral-700 transition-all hover:border-[#fc3f07] hover:text-[#fc3f07]"
            >
              Create a free account
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>

          </div>
        </div>
      </div>

    </div>
  );
}
