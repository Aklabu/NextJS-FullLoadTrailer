# Accounts & Auth API — Endpoint Reference

Base URL: `http://localhost:8000/api/accounts/`
Auth header: `Authorization: Bearer <accesstoken>`

---

## Workflows

**Registration**
`POST /register/` → OTP sent → `POST /otp/verify/` (purpose: `emailverification`) → account active

**Login (2-step)**
`POST /login/` → credentials verified → OTP sent → `POST /otp/verify/` (purpose: `login2fa`) → JWT tokens returned

**Password reset**
`POST /password/forgot/` → OTP sent → `POST /otp/verify/` (purpose: `passwordreset`) → get `resettoken` → `POST /password/reset/`

**Tier rules**
- `marketplace` tier accounts start as `pending` — cannot log in until admin approves.
- `bulletin` tier accounts get `basic` access immediately after email verification.

---

## Auth

### POST /api/accounts/register/
Public. `multipart/form-data` — supports document uploads.

**Body fields:**
| Field | Required | Notes |
|---|---|---|
| `role` | Yes | `shipper` \| `broker` \| `carrier` |
| `tier` | Yes | `bulletin` \| `marketplace` |
| `companyname` | Yes | |
| `email` | Yes | |
| `phone` | Yes | |
| `addressline1` | Yes | |
| `city` | Yes | |
| `state` | Yes | |
| `zipcode` | Yes | |
| `password` | Yes | |
| `dotnumber` | No | |
| `mcnumber` | No | |
| `businesslicensenumber` | No | |
| `stateofincorporation` | No | |
| `documentfiles` | No | Repeat for multiple. PDF/PNG/JPG, max 25 MB each |

**Success 201**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Registration initiated. Please check your email for a 6-digit verification code.",
  "timestamp": "2026-10-07T11:00:00Z",
  "data": { "email": "info@fastfreight.com" },
  "errors": null
}
```

**Error 400 — email already registered**
```json
{ "errors": { "email": ["An account with this email already exists."] } }
```

**Error 400 — weak password**
```json
{ "errors": { "password": ["This password is too common."] } }
```

**Error 400 — bad document file**
```json
{ "errors": { "documentfiles": ["File \"resume.docx\" must be a PDF, PNG, or JPG."] } }
```

---

### POST /api/accounts/login/
Public. Step 1 of 2 — verifies credentials and sends OTP. Does not return tokens.

**Body:**
```json
{ "email": "info@fastfreight.com", "password": "Secure@123" }
```

**Success 200**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Credentials verified. A login code has been sent to your email.",
  "data": { "email": "info@fastfreight.com" },
  "errors": null
}
```

**Error 400 — wrong credentials**
```json
{ "errors": { "detail": "Invalid email or password." } }
```

**Error 400 — email not verified**
```json
{ "errors": { "detail": "Email not verified. Please verify your email first.", "code": "emailnotverified" } }
```

**Error 400 — marketplace account pending**
```json
{ "errors": { "detail": "Your account is pending verification.", "code": "accountnotverified" } }
```

---

### POST /api/accounts/otp/verify/
Public. Handles all three OTP purposes — response shape differs per purpose.

**Body:**
```json
{ "email": "info@fastfreight.com", "otpcode": "482910", "purpose": "login2fa" }
```

Valid `purpose` values: `emailverification` | `login2fa` | `passwordreset`

**Success — login2fa** (returns JWT tokens)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful.",
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIs...",
    "refresh": "eyJhbGciOiJIUzI1NiIs...",
    "userid": "b2c3d4e5-0000-0000-0000-000000000002",
    "email": "info@fastfreight.com",
    "role": "carrier",
    "tier": "marketplace",
    "verificationstatus": "verified",
    "companyname": "FastFreight LLC",
    "hasseenonboarding": false
  },
  "errors": null
}
```

**Success — emailverification** (activates account)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Email verified. Your account is now active.",
  "data": { "verified": true, "companyid": "a1b2c3d4-0000-0000-0000-000000000001" },
  "errors": null
}
```

**Success — passwordreset** (returns one-time reset token)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified. Use the resettoken to set your new password.",
  "data": { "resettoken": "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
  "errors": null
}
```

**Error 400 — wrong code**
```json
{ "errors": { "otpcode": ["Invalid code."] } }
```

**Error 400 — expired / already used**
```json
{ "errors": { "otpcode": ["Code has expired or already been used."] } }
```

**Error 400 — email not found**
```json
{ "errors": { "email": ["No account found with this email."] } }
```

---

### POST /api/accounts/token/refresh/
Public. Call when access token expires (401 on any protected route).

**Body:**
```json
{ "refresh": "eyJhbGciOiJIUzI1NiIs..." }
```

**Success 200**
```json
{ "access": "eyJhbGciOiJIUzI1NiIs...", "refresh": "eyJhbGciOiJIUzI1NiIs..." }
```

**Error 401**
```json
{ "detail": "Token is invalid or expired.", "code": "tokennotvalid" }
```

---

## Profile

### GET /api/accounts/me/
Auth required. Returns the authenticated user's company profile.

**Success 200**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved.",
  "data": {
    "id": "a1b2c3d4-0000-0000-0000-000000000001",
    "email": "info@fastfreight.com",
    "role": "carrier",
    "tier": "marketplace",
    "verificationstatus": "verified",
    "name": "FastFreight LLC",
    "hasseenonboarding": false,
    "phone": "312-555-0100",
    "addressline1": "400 W Erie St",
    "addressline2": "",
    "city": "Chicago",
    "state": "IL",
    "zipcode": "60654",
    "website": "https://fastfreight.com",
    "submittedat": "2026-09-01T10:00:00Z",
    "reviewedat": "2026-09-03T14:00:00Z"
  },
  "errors": null
}
```

---

### PATCH /api/accounts/me/
Auth required. `application/json`.
Editable fields only: `name` `phone` `addressline1` `addressline2` `city` `state` `zipcode` `website`
Email and role are locked.

Returns the full updated profile (same shape as GET /me/).

---

### GET /api/accounts/me/verification-status/
Auth required.

**Success 200**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Verification status retrieved.",
  "data": {
    "status": "needsinfo",
    "rejectionreason": "",
    "inforequested": "Please resubmit your COI with an updated expiry date.",
    "submittedat": "2026-09-01T10:00:00Z",
    "reviewedat": "2026-09-04T09:00:00Z"
  },
  "errors": null
}
```

**Status values:**
| Value | Meaning |
|---|---|
| `unverified` | Never submitted documents |
| `pending` | Submitted, awaiting admin review |
| `basic` | Bulletin tier — active, no full verification needed |
| `verified` | Full marketplace access granted |
| `needsinfo` | Admin requested additional documents |
| `rejected` | Application rejected |

---

### POST /api/accounts/me/onboarding-seen/
Auth required. Empty body. Flips `hasseenonboarding` to true.

**Success 204**
```json
{ "success": true, "statusCode": 204, "message": "Onboarding marked as seen.", "data": null, "errors": null }
```

---

## Documents

### GET /api/accounts/me/documents/
Auth required.

**Success 200**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Documents retrieved.",
  "data": [
    {
      "id": "ee1234ab-0000-0000-0000-aabbcc001122",
      "doctype": "coi",
      "fileurl": "http://localhost:8000/media/accounts/.../COI2026.pdf",
      "filename": "COI2026.pdf",
      "filesize": 204800,
      "uploadedat": "2026-09-01T10:05:00Z"
    }
  ],
  "errors": null
}
```

---

### POST /api/accounts/me/documents/
Auth required. `multipart/form-data`.

**Body:** `doctype` + `file` (PDF/PNG/JPG, max 25 MB)

Valid `doctype` values: `insurance` | `authority` | `businesslicense` | `coi` | `other`

**Success 201**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Document uploaded successfully.",
  "data": {
    "id": "ff001122-0000-0000-0000-000000000010",
    "doctype": "coi",
    "fileurl": "http://localhost:8000/media/accounts/.../COI2026.pdf",
    "filename": "COI2026.pdf",
    "filesize": 204800,
    "uploadedat": "2026-10-07T11:00:00Z"
  },
  "errors": null
}
```

**Error 400 — file too large**
```json
{ "errors": { "file": ["File size must not exceed 25 MB."] } }
```

**Error 400 — invalid file type**
```json
{ "errors": { "file": ["Only PDF, PNG, and JPG files are accepted."] } }
```

---

### DELETE /api/accounts/me/documents/{docid}/
Auth required.

**Success 204**
```json
{ "success": true, "statusCode": 204, "message": "Document deleted.", "data": null, "errors": null }
```

**Error 404**
```json
{ "success": false, "statusCode": 404, "message": "Document not found.", "data": null, "errors": null }
```

---

## Password

### POST /api/accounts/password/forgot/
Public. Always returns 200 — does not reveal whether email exists.

**Body:** `{ "email": "info@fastfreight.com" }`

**Success 200**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "If an account with that email exists, a reset code has been sent.",
  "data": null,
  "errors": null
}
```

After this, direct the user to `POST /otp/verify/` with `purpose: passwordreset`.

---

### POST /api/accounts/password/reset/
Public. Uses the `resettoken` from `/otp/verify/` — valid 15 minutes, single use.

**Body:**
```json
{
  "resettoken": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "newpassword": "NewSecure@456",
  "confirmpassword": "NewSecure@456"
}
```

**Success 200**
```json
{ "success": true, "statusCode": 200, "message": "Password reset successful.", "data": null, "errors": null }
```

**Error 400 — token invalid/expired**
```json
{ "errors": { "resettoken": ["Invalid or expired reset token."] } }
```

**Error 400 — passwords don't match**
```json
{ "errors": { "confirmpassword": ["Passwords do not match."] } }
```

---

### POST /api/accounts/password/change/
Auth required.

**Body:**
```json
{
  "oldpassword": "Secure@123",
  "newpassword": "NewSecure@456",
  "confirmpassword": "NewSecure@456"
}
```

**Success 200**
```json
{ "success": true, "statusCode": 200, "message": "Password changed successfully.", "data": null, "errors": null }
```

**Error 400 — wrong old password**
```json
{ "errors": { "oldpassword": ["Incorrect password."] } }
```

**Error 400 — same as old**
```json
{ "errors": { "newpassword": ["New password must differ from the old password."] } }
```

**Error 400 — passwords don't match**
```json
{ "errors": { "confirmpassword": ["Passwords do not match."] } }
```
