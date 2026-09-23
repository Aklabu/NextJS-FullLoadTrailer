import type { Role, Tier, RoleFields, FieldErrors } from './useRegistrationForm';

interface Props {
  role: Role;
  tier: Tier;
  fields: RoleFields;
  errors: FieldErrors;
  onTierChange: (t: Tier) => void;
  onFieldChange: (key: keyof RoleFields, value: string) => void;
}

function Field({
  id, label, value, onChange, error, placeholder, hint,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label} <span className="text-red-500" aria-hidden="true">*</span>
      </label>
      {hint && <p className="mb-2 text-xs text-neutral-400">{hint}</p>}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
        style={{ borderColor: error ? '#ef4444' : '#e0d5c8' }}
      />
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
}

const ROLE_LABELS: Record<Role, string> = {
  shipper: 'Shipper / Moving Company',
  broker: 'Freight Broker',
  carrier: 'Carrier / Owner-Operator',
};

export default function StepRoleFields({ role, tier, fields, errors, onTierChange, onFieldChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2
          className="mb-1 text-xl font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Role & verification tier
        </h2>
        <p className="text-sm text-neutral-500">
          Registering as: <span className="font-medium text-neutral-700">{ROLE_LABELS[role]}</span>
        </p>
      </div>

      {/* Tier selector */}
      <div>
        <p className="mb-3 text-sm font-medium text-neutral-700">Choose your verification level</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Basic */}
          <button
            type="button"
            onClick={() => onTierChange('basic')}
            className="flex flex-col rounded-xl border-2 p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-[#fc3f07]"
            style={{
              borderColor: tier === 'basic' ? '#fc3f07' : '#e8e0d6',
              background: tier === 'basic' ? '#fff8f2' : '#fff',
            }}
            aria-pressed={tier === 'basic'}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]"
                style={{ background: '#f3ede4', color: '#7a7168' }}
              >
                FREE — ALWAYS
              </span>
              {tier === 'basic' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: '#fc3f07' }} aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="mb-1 text-sm font-semibold text-neutral-800">Basic — Bulletin Board</p>
            <p className="text-xs leading-relaxed text-neutral-500">
              Post and browse community listings. No pricing or bidding — great for getting started.
            </p>
          </button>

          {/* Advanced */}
          <button
            type="button"
            onClick={() => onTierChange('advanced')}
            className="flex flex-col rounded-xl border-2 p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-[#fc3f07]"
            style={{
              borderColor: tier === 'advanced' ? '#fc3f07' : '#e8e0d6',
              background: tier === 'advanced' ? '#fff8f2' : '#fff',
            }}
            aria-pressed={tier === 'advanced'}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px]"
                style={{ background: '#fff0e0', color: '#d93506' }}
              >
                TIER 2
              </span>
              {tier === 'advanced' && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: '#fc3f07' }} aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
            <p className="mb-1 text-sm font-semibold text-neutral-800">Advanced — Marketplace</p>
            <p className="text-xs leading-relaxed text-neutral-500">
              Full bidding, counteroffers, booking confirmations, and in-platform messaging.
              Requires compliance docs.
            </p>
          </button>
        </div>
      </div>

      {/* Role-specific fields — only shown for advanced tier */}
      {tier === 'advanced' && (
        <div className="space-y-5 rounded-xl border border-[#f0c896] bg-[#fffbf5] p-5">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-[#fc3f07]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs leading-relaxed text-[#7a4a1a]">
              Advanced verification requires compliance credentials. These will be reviewed by our team before marketplace access is granted.
            </p>
          </div>

          {role === 'carrier' ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id="dotNumber" label="DOT Number"
                value={fields.dotNumber} onChange={(v) => onFieldChange('dotNumber', v)}
                error={errors.dotNumber} placeholder="e.g. 1234567"
                hint="FMCSA-issued USDOT number"
              />
              <Field
                id="mcNumber" label="MC Number"
                value={fields.mcNumber} onChange={(v) => onFieldChange('mcNumber', v)}
                error={errors.mcNumber} placeholder="e.g. MC-8765432"
                hint="FMCSA Motor Carrier authority"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id="businessLicenseNumber" label="Business License Number"
                value={fields.businessLicenseNumber} onChange={(v) => onFieldChange('businessLicenseNumber', v)}
                error={errors.businessLicenseNumber} placeholder="e.g. BL-2024-00123"
                hint="State-issued business license"
              />
              <Field
                id="stateOfIncorporation" label="State of Incorporation"
                value={fields.stateOfIncorporation} onChange={(v) => onFieldChange('stateOfIncorporation', v)}
                error={errors.stateOfIncorporation} placeholder="e.g. Delaware"
                hint="Where your entity is registered"
              />
            </div>
          )}
        </div>
      )}

      {/* Basic tier note */}
      {tier === 'basic' && (
        <p className="rounded-xl border border-[#e8e0d6] bg-[#fafaf8] p-4 text-xs leading-relaxed text-neutral-500">
          You can upgrade to Advanced verification anytime from your account settings.
          Advanced unlocks bidding, counteroffers, and booking confirmations.
        </p>
      )}
    </div>
  );
}
