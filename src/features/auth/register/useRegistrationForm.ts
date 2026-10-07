'use client';

import { useState, useCallback } from 'react';
import { register } from '@/features/auth/api/authApi';
import { ApiError } from '@/lib/api/client';

export type Role = 'shipper' | 'broker' | 'carrier';
// tier maps to API values: basic → bulletin, advanced → marketplace
export type Tier = 'basic' | 'advanced';
export type Step = 1 | 2 | 3 | 4;

export interface UploadedFile {
  id: string;
  file: File;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'done' | 'error';
  errorMsg?: string;
}

export interface CompanyInfo {
  companyName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface RoleFields {
  // Carrier + marketplace tier
  dotNumber: string;
  mcNumber: string;
  // Broker / Shipper + marketplace tier
  businessLicenseNumber: string;
  stateOfIncorporation: string;
}

export interface PasswordFields {
  password: string;
  confirmPassword: string;
}

export interface FieldErrors {
  [key: string]: string;
}

const emptyCompany: CompanyInfo = {
  companyName: '', email: '', phone: '',
  addressLine1: '', addressLine2: '', city: '', state: '', zip: '', country: 'US',
};

const emptyRole: RoleFields = {
  dotNumber: '', mcNumber: '', businessLicenseNumber: '', stateOfIncorporation: '',
};

const emptyPassword: PasswordFields = { password: '', confirmPassword: '' };

function validateCompany(f: CompanyInfo): FieldErrors {
  const e: FieldErrors = {};
  if (!f.companyName.trim()) e.companyName = 'Company name is required.';
  if (!f.email.trim()) e.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address.';
  if (!f.phone.trim()) e.phone = 'Phone number is required.';
  if (!f.addressLine1.trim()) e.addressLine1 = 'Street address is required.';
  if (!f.city.trim()) e.city = 'City is required.';
  if (!f.state.trim()) e.state = 'State is required.';
  if (!f.zip.trim()) e.zip = 'ZIP / Postal code is required.';
  return e;
}

function validateRoleFields(_role: Role, _tier: Tier, _f: RoleFields): FieldErrors {
  // All compliance fields are optional regardless of role or tier
  return {};
}

function validatePassword(f: PasswordFields): FieldErrors {
  const e: FieldErrors = {};
  if (!f.password) e.password = 'Password is required.';
  else if (f.password.length < 8) e.password = 'Password must be at least 8 characters.';
  if (!f.confirmPassword) e.confirmPassword = 'Please confirm your password.';
  else if (f.password !== f.confirmPassword) e.confirmPassword = 'Passwords do not match.';
  return e;
}

export function passwordStrength(pw: string): { level: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!pw) return { level: 0, label: '' };
  if (pw.length < 8) return { level: 1, label: 'Weak' };
  if (pw.length >= 12 && /[^a-zA-Z0-9]/.test(pw) && /[A-Z]/.test(pw)) return { level: 4, label: 'Strong' };
  if (pw.length >= 10 && (/[^a-zA-Z0-9]/.test(pw) || /[A-Z]/.test(pw))) return { level: 3, label: 'Good' };
  return { level: 2, label: 'Fair' };
}

export type SubmitStatus = 'idle' | 'submitting' | 'error';

export function useRegistrationForm(initialRole: Role) {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>(initialRole);
  const [tier, setTier] = useState<Tier>('basic');

  const [company, setCompany] = useState<CompanyInfo>(emptyCompany);
  const [roleFields, setRoleFields] = useState<RoleFields>(emptyRole);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [passwordFields, setPasswordFields] = useState<PasswordFields>(emptyPassword);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState('');

  // Update company field + clear its error
  const setCompanyField = useCallback((key: keyof CompanyInfo, value: string) => {
    setCompany((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  // Update role field + clear its error
  const setRoleField = useCallback((key: keyof RoleFields, value: string) => {
    setRoleFields((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  // Update password field + clear its error
  const setPasswordField = useCallback((key: keyof PasswordFields, value: string) => {
    setPasswordFields((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
  }, []);

  // Stage files for upload — sent as document_files[] in the registration FormData
  const addFiles = useCallback((files: File[]) => {
    const newEntries: UploadedFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: 'pending',
    }));
    setUploadedFiles((prev) => [...prev, ...newEntries]);
  }, []);

  // Remove a staged file
  const removeFile = useCallback((id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // Advance to next step after per-step validation
  function nextStep() {
    let errors: FieldErrors = {};
    if (step === 1) errors = validateCompany(company);
    if (step === 2) errors = validateRoleFields(role, tier, roleFields);
    // Step 3 (documents) is skippable for bulletin tier
    if (step === 4) errors = validatePassword(passwordFields);

    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setStep((s) => Math.min(s + 1, 4) as Step);
  }

  function prevStep() {
    setFieldErrors({});
    setStep((s) => Math.max(s - 1, 1) as Step);
  }

  // Final submit — calls register() which builds FormData with files attached
  async function handleSubmit(): Promise<boolean> {
    const errors = validatePassword(passwordFields);
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return false; }

    setSubmitStatus('submitting');
    setSubmitError('');

    try {
      // Map internal tier value to what the API expects
      const apiTier = tier === 'advanced' ? 'marketplace' : 'bulletin';

      await register({
        role,
        tier: apiTier,
        company_name: company.companyName,
        email: company.email,
        phone: company.phone,
        address_line1: company.addressLine1,
        address_line2: company.addressLine2 || undefined,
        city: company.city,
        state: company.state,
        zip_code: company.zip,
        password: passwordFields.password,
        dot_number: roleFields.dotNumber || undefined,
        mc_number: roleFields.mcNumber || undefined,
        business_license_number: roleFields.businessLicenseNumber || undefined,
        state_of_incorporation: roleFields.stateOfIncorporation || undefined,
        document_files: uploadedFiles.map((u) => u.file),
      });

      setSubmitStatus('idle');
      return true;
    } catch (err) {
      setSubmitStatus('error');
      if (err instanceof ApiError) {
        // Surface first field-level error if present, otherwise the message
        const firstFieldError = err.errors
          ? (Object.values(err.errors).flat()[0] as string)
          : null;
        setSubmitError(firstFieldError ?? err.message);
      } else {
        setSubmitError('Unable to connect. Check your internet and try again.');
      }
      return false;
    }
  }

  return {
    step, role, tier, setRole, setTier,
    company, setCompanyField,
    roleFields, setRoleField,
    uploadedFiles, addFiles, removeFile,
    passwordFields, setPasswordField,
    fieldErrors,
    submitStatus, submitError,
    nextStep, prevStep, handleSubmit,
  };
}
