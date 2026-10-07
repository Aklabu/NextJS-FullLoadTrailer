'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOtp, type EmailVerifiedData } from '@/features/auth/api/authApi';
import { ApiError } from '@/lib/api/client';

type PageState = 'idle' | 'loading' | 'error' | 'success';

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') ?? '';

  const [otpCode, setOtpCode] = useState('');
  const [pageState, setPageState] = useState<PageState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  // Start resend countdown immediately on mount — OTP was just sent by /register/
  useEffect(() => {
    startCooldown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCooldown() {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((n) => {
        if (n <= 1) { clearInterval(interval); return 0; }
        return n - 1;
      });
    }, 1000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.trim().length !== 6) return;

    setPageState('loading');
    setErrorMsg('');

    try {
      const res = await verifyOtp({
        email,
        otp_code: otpCode.trim(),
        purpose: 'email_verification',
      });
      // Verify the account was activated
      const data = res.data as EmailVerifiedData;
      if (data?.verified) {
        setPageState('success');
        // Brief success moment, then send to verify-status
        setTimeout(() => router.push('/auth/verify-status'), 1200);
      } else {
        setPageState('error');
        setErrorMsg('Verification failed. Please try again.');
      }
    } catch (err) {
      setPageState('error');
      if (err instanceof ApiError) {
        const otpErr = err.errors?.otp_code;
        const emailErr = err.errors?.email;
        if (Array.isArray(otpErr)) setErrorMsg(otpErr[0]);
        else if (typeof otpErr === 'string') setErrorMsg(otpErr);
        else if (Array.isArray(emailErr)) setErrorMsg(emailErr[0]);
        else setErrorMsg(err.message);
      } else {
        setErrorMsg('Unable to connect. Check your internet and try again.');
      }
    }
  }

  // Resend — there is no dedicated resend endpoint; instruct user to re-register
  // The API will resend OTP on a fresh /register/ call with the same email
  async function handleResend() {
    if (resendCooldown > 0) return;
    // Navigate back to register so the user can re-submit and trigger a new OTP
    router.push(`/auth/register?email=${encodeURIComponent(email)}`);
  }

  const isLoading = pageState === 'loading';
  const isSuccess = pageState === 'success';

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(circle at 15% 10%, #fbe3c4, transparent 50%), radial-gradient(circle at 85% 20%, #f6d9d3, transparent 50%), #fdf6ee',
      }}
    >
      {/* Top bar */}
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2" aria-label="FullTrailerLoad home">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold"
            style={{ background: '#ff3d03', color: '#1A1953' }}
            aria-hidden="true"
          >
            FL
          </span>
          <span className="text-base font-semibold tracking-tight text-neutral-900">
            FullTrailer<span style={{ color: '#fc3f07' }}>Load</span>
          </span>
        </Link>
        <Link
          href="/auth/login"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
        >
          Back to login
        </Link>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[520px] px-6 pb-20 pt-6">

        {/* Page header */}
        <div className="mb-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fc3f07]" />
            VERIFY YOUR EMAIL
          </span>
          <h1
            className="mt-3 text-[clamp(24px,4vw,34px)] font-normal leading-tight text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-neutral-700">
              {email || 'your email address'}
            </span>
            . Enter it below to activate your account.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm">

          {/* Success state */}
          {isSuccess && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: '#f0fdf4' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-neutral-800">Email verified!</p>
                <p className="mt-1 text-sm text-neutral-500">Redirecting you now…</p>
              </div>
            </div>
          )}

          {/* OTP form */}
          {!isSuccess && (
            <>
              {/* Error banner */}
              {pageState === 'error' && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Verification code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                      if (pageState === 'error') { setPageState('idle'); setErrorMsg(''); }
                    }}
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-[#e0d5c8] bg-white px-4 py-3 text-center font-mono text-xl tracking-[0.5em] text-neutral-900 placeholder:text-neutral-300 outline-none transition-colors focus:border-[#fc3f07] focus:ring-2 focus:ring-[#fc3f07]/20 disabled:opacity-60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506] hover:enabled:scale-[1.01]"
                  style={{ background: '#fc3f07' }}
                >
                  {isLoading ? <><Spinner />Verifying…</> : <>Verify email <Arrow /></>}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between text-sm">
                <Link
                  href={`/auth/register`}
                  className="text-neutral-400 underline underline-offset-2 hover:text-neutral-600"
                >
                  ← Start over
                </Link>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Info note */}
        <p className="mt-5 text-center text-xs text-neutral-400">
          Didn&apos;t get the email? Check your spam folder, or{' '}
          <Link href="/contact" className="font-medium text-neutral-500 underline underline-offset-2 hover:text-neutral-700">
            contact support
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
