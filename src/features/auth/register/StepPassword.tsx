'use client';

import { useState } from 'react';
import type { PasswordFields, FieldErrors } from './useRegistrationForm';
import { passwordStrength } from './useRegistrationForm';

interface Props {
  fields: PasswordFields;
  errors: FieldErrors;
  onChange: (key: keyof PasswordFields, value: string) => void;
}

const STRENGTH_COLORS = ['#e8e0d6', '#ef4444', '#f59e0b', '#84cc16', '#22c55e'];
const STRENGTH_BG = ['bg-[#e8e0d6]', 'bg-red-400', 'bg-amber-400', 'bg-lime-400', 'bg-green-500'];

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

export default function StepPassword({ fields, errors, onChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = passwordStrength(fields.password);
  const mismatch = fields.confirmPassword.length > 0 && fields.password !== fields.confirmPassword;

  return (
    <div className="space-y-5">
      <div>
        <h2
          className="mb-1 text-xl font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Create your password
        </h2>
        <p className="text-sm text-neutral-500">
          Choose a strong password to secure your account.
        </p>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-neutral-700">
          Password <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={fields.password}
            onChange={(e) => onChange('password', e.target.value)}
            placeholder="Min. 8 characters"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'reg-password-error' : 'password-strength'}
            className="w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#d97b3f]/20"
            style={{ borderColor: errors.password ? '#ef4444' : '#e0d5c8' }}
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
        {errors.password && (
          <p id="reg-password-error" className="mt-1.5 text-xs text-red-500" role="alert">{errors.password}</p>
        )}

        {/* Strength bar */}
        {fields.password.length > 0 && (
          <div id="password-strength" className="mt-2.5" aria-live="polite">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="h-1 flex-1 rounded-full transition-colors duration-300"
                  style={{ background: level <= strength.level ? STRENGTH_COLORS[strength.level] : '#e8e0d6' }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="mt-1 text-xs" style={{ color: STRENGTH_COLORS[strength.level] }}>
              {strength.label} password
            </p>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="reg-confirm" className="mb-1.5 block text-sm font-medium text-neutral-700">
          Confirm password <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <div className="relative">
          <input
            id="reg-confirm"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            value={fields.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            placeholder="Repeat your password"
            aria-invalid={!!errors.confirmPassword || mismatch}
            aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
            className="w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#d97b3f]/20"
            style={{ borderColor: (errors.confirmPassword || mismatch) ? '#ef4444' : '#e0d5c8' }}
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
        {(errors.confirmPassword || mismatch) && (
          <p id="reg-confirm-error" className="mt-1.5 text-xs text-red-500" role="alert">
            {errors.confirmPassword ?? "Passwords don't match."}
          </p>
        )}
        {!errors.confirmPassword && !mismatch && fields.confirmPassword.length > 0 && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Passwords match
          </p>
        )}
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1.5 rounded-xl border border-[#e8e0d6] bg-[#fafaf8] p-4" aria-label="Password requirements">
        {[
          { met: fields.password.length >= 8, text: 'At least 8 characters' },
          { met: /[A-Z]/.test(fields.password), text: 'One uppercase letter' },
          { met: /[0-9]/.test(fields.password), text: 'One number' },
          { met: /[^a-zA-Z0-9]/.test(fields.password), text: 'One special character (recommended)' },
        ].map(({ met, text }) => (
          <li key={text} className="flex items-center gap-2 text-xs">
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
              style={{ background: met ? '#dcfce7' : '#f3ede4' }}
              aria-hidden="true"
            >
              {met ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-[#ccc]" />
              )}
            </span>
            <span style={{ color: met ? '#166534' : '#a09080' }}>{text}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-neutral-400">
        By creating an account you agree to our{' '}
        <a href="/terms" className="text-[#d97b3f] underline underline-offset-2 hover:text-[#c2622b]" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-[#d97b3f] underline underline-offset-2 hover:text-[#c2622b]" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
      </p>
    </div>
  );
}
