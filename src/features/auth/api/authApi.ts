// All Account & Auth API calls — one function per endpoint.
// Import from this file in components; never call apiFetch directly for auth operations.

import { apiFetch } from '@/lib/api/client';
import type { UserRole, UserTier, VerificationStatus } from '@/lib/types/auth';

// ─── Response types ──────────────────────────────────────────────────────────

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: { email: string };
}

export interface LoginStep1Response {
  success: boolean;
  message: string;
  data: { email: string };
}

// Returned by /otp/verify/ when purpose === 'login_2fa'
export interface LoginTokenData {
  access: string;
  refresh: string;
  user_id: string;
  email: string;
  role: UserRole;
  tier: UserTier;
  verification_status: VerificationStatus;
  company_name: string;
  has_seen_onboarding: boolean;
}

// Returned by /otp/verify/ when purpose === 'email_verification'
export interface EmailVerifiedData {
  verified: boolean;
  company_id: string;
}

// Returned by /otp/verify/ when purpose === 'password_reset'
export interface PasswordResetOtpData {
  reset_token: string;
}

export type OtpPurpose = 'login_2fa' | 'email_verification' | 'password_reset';

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  data: LoginTokenData | EmailVerifiedData | PasswordResetOtpData;
}

export interface MeResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    role: UserRole;
    tier: UserTier;
    verification_status: VerificationStatus;
    name: string;
    has_seen_onboarding: boolean;
    phone: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    zip_code: string;
    website: string;
    submitted_at: string | null;
    reviewed_at: string | null;
  };
}

export interface VerificationStatusResponse {
  success: boolean;
  data: {
    status: VerificationStatus;
    rejection_reason: string;
    info_requested: string;
    submitted_at: string | null;
    reviewed_at: string | null;
  };
}

export interface DocumentItem {
  id: string;
  doc_type: 'insurance' | 'authority' | 'business_license' | 'coi' | 'other';
  file_url: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
}

export interface DocumentsResponse {
  success: boolean;
  data: DocumentItem[];
}

export interface DocumentUploadResponse {
  success: boolean;
  data: DocumentItem;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

// POST /api/accounts/register/  — multipart/form-data
export async function register(params: {
  role: UserRole;
  tier: UserTier;
  company_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  password: string;
  dot_number?: string;
  mc_number?: string;
  business_license_number?: string;
  state_of_incorporation?: string;
  document_files?: File[];
}): Promise<RegisterResponse> {
  // Use FormData so document files can be attached alongside text fields
  const body = new FormData();
  body.append('role', params.role);
  body.append('tier', params.tier);
  body.append('company_name', params.company_name);
  body.append('email', params.email);
  body.append('phone', params.phone);
  body.append('address_line1', params.address_line1);
  if (params.address_line2) body.append('address_line2', params.address_line2);
  body.append('city', params.city);
  body.append('state', params.state);
  body.append('zip_code', params.zip_code);
  body.append('password', params.password);
  if (params.dot_number) body.append('dot_number', params.dot_number);
  if (params.mc_number) body.append('mc_number', params.mc_number);
  if (params.business_license_number) body.append('business_license_number', params.business_license_number);
  if (params.state_of_incorporation) body.append('state_of_incorporation', params.state_of_incorporation);
  // Append each file under the same field name — Django reads getlist('document_files')
  params.document_files?.forEach((file) => body.append('document_files', file));

  return apiFetch<RegisterResponse>('/api/accounts/register/', {
    method: 'POST',
    body,
    skipAuth: true,
  });
}

// POST /api/accounts/login/  — step 1: verify credentials, trigger OTP send
export async function loginStep1(email: string, password: string): Promise<LoginStep1Response> {
  return apiFetch<LoginStep1Response>('/api/accounts/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
}

// POST /api/accounts/otp/verify/  — handles all three purposes
export async function verifyOtp(params: {
  email: string;
  otp_code: string;
  purpose: OtpPurpose;
}): Promise<OtpVerifyResponse> {
  return apiFetch<OtpVerifyResponse>('/api/accounts/otp/verify/', {
    method: 'POST',
    body: JSON.stringify(params),
    skipAuth: true,
  });
}

// POST /api/accounts/token/refresh/  — exchange refresh token for new access+refresh pair
export async function refreshTokens(refresh: string): Promise<{ access: string; refresh: string }> {
  return apiFetch<{ access: string; refresh: string }>('/api/accounts/token/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
    skipAuth: true,
    skipRefresh: true, // never recurse on the refresh endpoint itself
  });
}

// ─── Profile ─────────────────────────────────────────────────────────────────

// GET /api/accounts/me/
export async function getMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>('/api/accounts/me/');
}

// PATCH /api/accounts/me/  — partial update of editable profile fields
export async function patchMe(fields: Partial<{
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
  website: string;
}>): Promise<MeResponse> {
  return apiFetch<MeResponse>('/api/accounts/me/', {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

// GET /api/accounts/me/verification-status/
export async function getVerificationStatus(): Promise<VerificationStatusResponse> {
  return apiFetch<VerificationStatusResponse>('/api/accounts/me/verification-status/');
}

// POST /api/accounts/me/onboarding-seen/  — fire-and-forget, no body required
export async function markOnboardingSeen(): Promise<void> {
  await apiFetch('/api/accounts/me/onboarding-seen/', { method: 'POST' });
}

// ─── Password ─────────────────────────────────────────────────────────────────

// POST /api/accounts/logout/  — blacklists the refresh token server-side
export async function logout(refresh: string): Promise<void> {
  // Fire-and-forget — clear tokens locally regardless of server response
  await apiFetch('/api/accounts/logout/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }).catch(() => {
    // Server errors (already blacklisted, expired) are non-critical — proceed with local logout
  });
}

// POST /api/accounts/password/forgot/  — always 200, does not reveal email existence
export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>('/api/accounts/password/forgot/', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  });
}

// POST /api/accounts/password/reset/  — uses reset_token from /otp/verify/
export async function resetPassword(params: {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>('/api/accounts/password/reset/', {
    method: 'POST',
    body: JSON.stringify(params),
    skipAuth: true,
  });
}

// POST /api/accounts/password/change/  — auth required, uses old password
export async function changePassword(params: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>('/api/accounts/password/change/', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

// ─── Documents ────────────────────────────────────────────────────────────────

// GET /api/accounts/me/documents/
export async function getDocuments(): Promise<DocumentsResponse> {
  return apiFetch<DocumentsResponse>('/api/accounts/me/documents/');
}

// POST /api/accounts/me/documents/  — multipart/form-data
export async function uploadDocument(
  doc_type: DocumentItem['doc_type'],
  file: File,
): Promise<DocumentUploadResponse> {
  const body = new FormData();
  body.append('doc_type', doc_type);
  body.append('file', file);
  return apiFetch<DocumentUploadResponse>('/api/accounts/me/documents/', {
    method: 'POST',
    body,
  });
}

// DELETE /api/accounts/me/documents/:doc_id/
export async function deleteDocument(doc_id: string): Promise<void> {
  await apiFetch(`/api/accounts/me/documents/${doc_id}/`, { method: 'DELETE' });
}
