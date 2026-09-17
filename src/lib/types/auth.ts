export type UserRole = 'shipper' | 'broker' | 'carrier';

export type VerificationStatus =
  | 'verified'
  | 'pending'
  | 'basic'
  | 'rejected'
  | 'unverified';

export type UserTier = 'bulletin' | 'marketplace';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  tier: UserTier;
  companyName: string;
  // True only on first login after verification approval
  hasSeenOnboarding: boolean;
}
