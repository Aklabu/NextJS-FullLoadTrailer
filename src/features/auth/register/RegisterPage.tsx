'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRegistrationForm, type Role } from './useRegistrationForm';
import ProgressSteps from './ProgressSteps';
import StepCompanyInfo from './StepCompanyInfo';
import StepRoleFields from './StepRoleFields';
import StepDocuments from './StepDocuments';
import StepPassword from './StepPassword';

const VALID_ROLES: Role[] = ['shipper', 'broker', 'carrier'];

function isValidRole(v: string | null): v is Role {
  return VALID_ROLES.includes(v as Role);
}

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const roleParam = params.get('role');
  const initialRole: Role = isValidRole(roleParam) ? roleParam : 'shipper';

  const form = useRegistrationForm(initialRole);

  // Sync role from query param on mount
  useEffect(() => {
    if (isValidRole(roleParam)) form.setRole(roleParam);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await form.handleSubmit();
    if (ok) router.push('/auth/verify-status');
  }

  const isLastStep = form.step === 4;
  const isSubmitting = form.submitStatus === 'submitting';

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
        <span className="text-sm text-neutral-500">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-[#fc3f07] underline underline-offset-2 hover:text-[#d93506]"
          >
            Log in
          </Link>
        </span>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[520px] px-6 pb-20 pt-6">

        {/* Page header */}
        <div className="mb-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e8c99a] bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-[#d93506]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fc3f07]" />
            CREATE YOUR ACCOUNT
          </span>
          <h1
            className="mt-3 text-[clamp(24px,4vw,34px)] font-normal leading-tight text-neutral-900"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Register your company
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Complete all steps to submit your account for review.
          </p>
        </div>

        {/* Step indicator */}
        <ProgressSteps current={form.step} />

        {/* Card */}
        <div className="rounded-2xl border border-[#e8e0d6] bg-white p-7 shadow-sm">

          {/* Submit error banner */}
          {form.submitStatus === 'error' && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{form.submitError}</p>
            </div>
          )}

          <form onSubmit={isLastStep ? handleFinalSubmit : (e) => { e.preventDefault(); form.nextStep(); }} noValidate>

            {/* Step content */}
            {form.step === 1 && (
              <StepCompanyInfo
                company={form.company}
                errors={form.fieldErrors}
                onChange={form.setCompanyField}
              />
            )}
            {form.step === 2 && (
              <StepRoleFields
                role={form.role}
                tier={form.tier}
                fields={form.roleFields}
                errors={form.fieldErrors}
                onTierChange={form.setTier}
                onFieldChange={form.setRoleField}
              />
            )}
            {form.step === 3 && (
              <StepDocuments
                tier={form.tier}
                files={form.uploadedFiles}
                onAdd={form.addFiles}
                onRemove={form.removeFile}
              />
            )}
            {form.step === 4 && (
              <StepPassword
                fields={form.passwordFields}
                errors={form.fieldErrors}
                onChange={form.setPasswordField}
              />
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {form.step > 1 ? (
                <button
                  type="button"
                  onClick={form.prevStep}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 rounded-xl border border-[#e0d5c8] bg-white px-5 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:border-[#fc3f07] hover:text-[#fc3f07] disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
              ) : (
                // Spacer so the next button stays right-aligned on step 1
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Change role
                </Link>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:enabled:bg-[#d93506]"
                style={{ background: '#fc3f07' }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </>
                ) : isLastStep ? (
                  <>
                    Submit for review
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Step 3 skip link for basic tier */}
        {form.step === 3 && form.tier === 'basic' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => form.nextStep()}
              className="text-sm text-neutral-400 underline underline-offset-2 hover:text-neutral-600"
            >
              Skip for now — add documents later
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
