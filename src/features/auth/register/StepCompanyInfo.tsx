import type { CompanyInfo, FieldErrors } from './useRegistrationForm';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

interface Props {
  company: CompanyInfo;
  errors: FieldErrors;
  onChange: (key: keyof CompanyInfo, value: string) => void;
}

function Field({
  id, label, value, onChange, error, type = 'text', placeholder, autoComplete, required = true,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; placeholder?: string; autoComplete?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}{required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20"
        style={{ borderColor: error ? '#ef4444' : '#e0d5c8', ...(error ? {} : { '--tw-ring-color': '#fc3f07' } as React.CSSProperties) }}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500" role="alert">{error}</p>
      )}
    </div>
  );
}

export default function StepCompanyInfo({ company, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h2
          className="mb-1 text-xl font-normal text-neutral-900"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Company information
        </h2>
        <p className="text-sm text-neutral-500">Tell us about your business. All fields marked <span className="text-red-500">*</span> are required.</p>
      </div>

      <Field
        id="companyName" label="Company / Business name"
        value={company.companyName} onChange={(v) => onChange('companyName', v)}
        error={errors.companyName} placeholder="Acme Freight LLC"
        autoComplete="organization"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          id="email" label="Business email" type="email"
          value={company.email} onChange={(v) => onChange('email', v)}
          error={errors.email} placeholder="ops@company.com"
          autoComplete="email"
        />
        <Field
          id="phone" label="Phone number" type="tel"
          value={company.phone} onChange={(v) => onChange('phone', v)}
          error={errors.phone} placeholder="+1 (555) 000-0000"
          autoComplete="tel"
        />
      </div>

      <Field
        id="addressLine1" label="Street address"
        value={company.addressLine1} onChange={(v) => onChange('addressLine1', v)}
        error={errors.addressLine1} placeholder="123 Main St"
        autoComplete="address-line1"
      />
      <Field
        id="addressLine2" label="Suite / Unit (optional)"
        value={company.addressLine2} onChange={(v) => onChange('addressLine2', v)}
        placeholder="Suite 400" autoComplete="address-line2" required={false}
      />

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2">
          <Field
            id="city" label="City"
            value={company.city} onChange={(v) => onChange('city', v)}
            error={errors.city} placeholder="Chicago"
            autoComplete="address-level2"
          />
        </div>

        <div>
          <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-neutral-700">
            State <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="state"
            value={company.state}
            onChange={(e) => onChange('state', e.target.value)}
            aria-invalid={!!errors.state}
            className="w-full rounded-xl border bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition-colors focus:ring-2 focus:ring-[#fc3f07]/20 appearance-none"
            style={{ borderColor: errors.state ? '#ef4444' : '#e0d5c8' }}
          >
            <option value="">State</option>
            {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="mt-1.5 text-xs text-red-500" role="alert">{errors.state}</p>}
        </div>

        <div>
          <Field
            id="zip" label="ZIP"
            value={company.zip} onChange={(v) => onChange('zip', v)}
            error={errors.zip} placeholder="60601"
            autoComplete="postal-code"
          />
        </div>
      </div>
    </div>
  );
}
